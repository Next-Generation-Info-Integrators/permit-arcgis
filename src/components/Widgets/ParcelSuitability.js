import styled from '@emotion/styled';
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { Chart } from "react-google-charts";


const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
  }));
  
const ParcelSuitability = ({score, onCustomSuitability}) => {

	return <Box>
		<Grid container spacing={2} >
			<Grid item xs={4}>
			<Typography component={'h1'} color="red" style={{'textAlign': 'center'}} gap={0}>Residential - {score}</Typography>
			
				<Chart 
				chartType="PieChart"
				data={[['Label', 'Value'],
				['',5 - score],
				['Suitability', score],
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
						'tooltip' : {
							trigger: 'none'
						  },
						'chartArea':{left:10,top:20,width:"100%",height:"100%"}
					
				}}
				/>
				<Typography component={'p'}>
				On a scale of 1 to 10, where 1 is least suitable and 10 is the most suitable for the given land-use
<br/>
The score is a result of how this land parcel performs
On the parameters mentioned on the right, and the relative
Importance each parameter is given 

Click here to do a 

<Button color="error" onClick={()=>{ onCustomSuitability()}}>custom suitability analysis</Button>

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
								Score
							</TableCell>
							<TableCell component="th">
								Meaning
							</TableCell>
							<TableCell component="th">
								Guam Average
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell align="left" component={'th'}>
								Flood Risk
							</TableCell>
							<TableCell align="right">
								0.238
							</TableCell>
							<TableCell align="right">
								4/5
							</TableCell>
							<TableCell align="right">
								Flood Zone X
							</TableCell>
							<TableCell align="right">
								Flood Rish
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component={'th'}>
								Distance from Main Road
							</TableCell>
							<TableCell align="right">
								0.238
							</TableCell>
							<TableCell align="right">
								3/5
							</TableCell>
							<TableCell align="right">
								0.25 to 0.05 miles
							</TableCell>
							<TableCell align="right">
								0.6 miles
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align="left" component={'th'}>
								Distance from Fire Station
							</TableCell>
							<TableCell align="right">
								0.342
							</TableCell>
							<TableCell align="right">
								4/5
							</TableCell>
							<TableCell align="right">
								1 to 2 miles
							</TableCell>
							<TableCell align="right">
								2.65 miles
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
				</TableContainer>
			</Grid>
		</Grid>
		
	</Box>

}
export default ParcelSuitability;