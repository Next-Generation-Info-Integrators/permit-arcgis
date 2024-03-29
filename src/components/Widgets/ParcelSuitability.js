import styled from '@emotion/styled';
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect } from 'react';
import { Chart } from "react-google-charts";
import Query from '@arcgis/core/rest/support/Query'
import {executeQueryJSON} from '@arcgis/core/rest/query';
import { GuamAverage } from '../../config/constants';
import FontAwesomeicon from '../FontAwesomeIcon';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
  }));
const ParcelSuitability = ({onCustomSuitability, criteria, type, parcelName}) => {

	const [suitabilityScore, setSuitabilityScore] = React.useState([]);
	const [matrix, setMatrix] = React.useState([]);
	// const [normolizeMetrix, setNormolizeMetrix] = React.useState([]);
	const [matrixScore, setMatrixScore] = React.useState({});
	const [criteriaWeight, setCriteriaWeight] = React.useState({});
	const [totalScore, setTotalScore] = React.useState(0);
	useEffect(()=>{
		const tbl = [];
		criteria.forEach((c,index)=>{
		criteria.forEach((cf,childIndex)=>{
			//if(childIndex>=index){
				if(index === childIndex) {
					tbl.push({label:c.label +' VS '+ cf.label,value:c.value +' VS '+ cf.value,pair: [index,childIndex],priority:1});
				} else {
					tbl.push({label:c.label +' VS '+ cf.label,value:c.value +' VS '+ cf.value,pair: [index,childIndex],priority:cf.priority});
				}
			// }
			
		})
	});
	setMatrix(tbl);
	},[criteria])
	useEffect(()=>{
		if(matrix.length>0) {
			const objScore = {};
			criteria.forEach((c, i)=>{
				let total = 0;
				criteria.forEach((d,j)=>{
					total += parseFloat(calculatePairwise(i,j));
				});
				objScore[i]= total;
			})
		setMatrixScore(objScore);
		}
		
	},[matrix])

	useEffect(()=>{
		if(Object.keys(matrixScore).length>0){
			let normolize = [];
			let sAvgScore = {};
			normolize = matrix.map((m,i) => {
				m.priority = m.priority / matrixScore[m.pair[0]];
				return m;
			})

			for(let i=0; i< criteria.length; i++) {
				let total = 0;
				for(let j=0; j< criteria.length; j++) {
					const m =  normolize.find(m => m.pair[0] === i && m.pair[1] === j);
					total += parseFloat(m.priority);
					
				}
				sAvgScore[criteria[i].key] = total/criteria.length;
			}
			setCriteriaWeight(sAvgScore)
		}
	  
	},[matrixScore])

	useEffect(() => {
		let queryUrl = "http://insight.eblpguam.com/arcgis/rest/services/permit/MapServer/12";

		// create the Query object
		let queryObject = new Query();
		
		queryObject.where = "Parcel_Sea='"+parcelName+"'";
		queryObject.outFields =[ 'Fire_Stations', 'Flood_Final', 'Hospitals','Main_Road_Points','Parks', 'Slope_sample', 'Schools','Distance_Residential','Distance_transport','HH_halfhour','Distance_Commercial','Distance_Ports' ];
		
		// call the executeQueryJSON() method
		executeQueryJSON(queryUrl, queryObject).then(function(results){
			if(results.features !== undefined) {
				setSuitabilityScore(results.features.map(function(feature){
					return feature.attributes
				}));
			}
			
		});
	},[])
	useEffect(()=>{
		if(suitabilityScore.length>0 && Object.keys(criteriaWeight).length>0)  {
		let total = 0;
		debugger;
		Object.keys(suitabilityScore[0]).forEach((key)=>{
			if(suitabilityScore[0][key]!=null && criteriaWeight[key] != null) {
				total+= parseFloat(suitabilityScore[0][key] * parseFloat(criteriaWeight[key]));
			}
		});
		setTotalScore( parseFloat(total.toFixed(2)));
	}
	},[suitabilityScore,criteriaWeight])
	const calculatePairwise = (i,j) => {
		if(matrix.find(p=>p.pair[0] === i && p.pair[1] === j)) {
			return (matrix.find(p=>p.pair[0] === i && p.pair[1] === j).priority).toFixed(2);
		} else if(matrix.find(p=>p.pair[0] === j && p.pair[1] === i)) {
			return (1/matrix.find(p=>p.pair[0] === j && p.pair[1] === i).priority).toFixed(2);
		}
	}
	return <Box>
		<Grid container spacing={2} >
			<Grid item xs={4}>
			<Typography component={'h1'} color="red" style={{'textAlign': 'center'}} gap={0}>{type} - {totalScore}</Typography>
			
				<Chart 
				chartType="PieChart"
				data={[['Label', 'Value'],
				['',5 - totalScore],
				['Suitability', totalScore],
			]
				}
				legendToggle ={false}
				height={'250px'}
				width ={'100%'}
				style={{borderColor:'#000',padding:'0px'}}
				options={{legend: {position:'none'},
				height: '250px',width:'100%',
						colors: ['#ccc', '#ff0000'],
						pieHole: 0.5,
						is3D: true,
						'tooltip' : {
							trigger: 'none'
						  },
						'chartArea':{left:10,top:20,width:"100%",height:"100%"}
					
				}}
				/>
				<Typography component={'p'}>
				On a scale of 1 to 5, where 1 is least suitable and 5 is the most suitable for the given land-use
<br/>
The score is a result of how this land parcel performs
On the parameters mentioned on the right, and the relative
Importance each parameter is given 

{/* Click here to do a 

<Button color="error" onClick={()=>{onCustomSuitability()}}>custom suitability analysis</Button> */}

				</Typography>
				
				</Grid>
			<Grid item xs={8}>
			<TableContainer component={Paper}>
				<Table  sx={{minWidth:'650px'}}>
					<TableHead>
						<TableRow>
							<TableCell component="th" >
								Paramter
							</TableCell>
							<TableCell component="th">
								Relative Weight
							</TableCell>
							<TableCell component="th">
								Score (1-5)
							</TableCell>
							<TableCell component="th">
								Meaning
							</TableCell>
							<TableCell component="th">
								Guam Average (1-5)
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{suitabilityScore.length > 0  && criteria.map(row => {
							const imgUrl = require(`../../assets/icons/${row.key}.png`);
							const parcelScore = Math.round(suitabilityScore[0][row.key]);
						return <TableRow>
							<TableCell align="left" component={'th'}>
								<FontAwesomeicon icon={row.icon}  size="xl" />
								{row.value}
							</TableCell>
							<TableCell align="right">
								{(criteriaWeight[row.key]*100).toFixed(2)}%
							</TableCell>
							<TableCell align="right">
								{isNaN(parcelScore) ? 'N/A' : parcelScore}
							</TableCell>
							<TableCell align="right">
							{isNaN(parcelScore) ? 'N/A' : row.meaning[parcelScore] }
							</TableCell>
							<TableCell align="right">
								{GuamAverage[row.key]}
							</TableCell>
					</TableRow>	
})}
					</TableBody>
				</Table>
				</TableContainer>
			</Grid>
		</Grid>
		
	</Box>

}
export default ParcelSuitability;