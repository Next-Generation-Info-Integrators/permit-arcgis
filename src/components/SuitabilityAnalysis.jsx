import React, { useEffect } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import draggable from "highcharts/modules/draggable-points";
import more from "highcharts/highcharts-more";
import { Button, Checkbox, Container, FormControl, FormControlLabel, InputLabel, ListItemText, makeStyles, MenuItem, OutlinedInput, Paper, Radio, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Box } from '@mui/system';
import Geoprocessor from '@arcgis/core/tasks/Geoprocessor';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';
import {suitabilityGoals } from '../config/constants';


if (typeof Highcharts === "object") {
	more(Highcharts);
	draggable(Highcharts);
  }

const SuitabilityAnalysis = ({view}) => {

	const [goal, setGoal] = React.useState({label:'',value:'',criteria_factors:[]});
	const [selectedCriteria, setSelectedCriteria] = React.useState([]);
	const [matrix, setMatrix] = React.useState([]);
	const [loading, setLoading] = React.useState(false);
	const [jobStatus, setJobStatus] = React.useState('');
	const goals = React.useMemo(()=>(suitabilityGoals),[]);
	const options = {
		chart: {
			type:'bar',
			animation: false,
			height:500
		},
		title: {
		  text: goal.label
		},
		xAxis: {
			categories: matrix.filter(p=>p.pair[0] !== p.pair[1]).map(c=>c.value),
			allowDecimals: false
		},
		yAxis: {
			min: 0,
			max: 11,
			allowDecimals: false
		},
		series: [{
		  data: matrix.filter(p=>p.pair[0] !== p.pair[1]).map(option => {
			return [ option.value, option.priority]
		  }),
		  draggableY: true,
		  zonesAxis: 'y',
                zones: [{
                    value: 3,
                    color: '#000000',
                }, {
                    value: 5,
                    color: '#3D0000',
                }, {
                    value: 8,
                    color: '#950101',
                }, {
                    color: '#FF0000',
                }]
		}],
		tooltip: {
			valueDecimals: 2
		},
		plotOptions: {
			bar: {
				dataLabels: {
					enabled: true
				}
			},
			series: {
				point: {
					events: {  
						drag: function (e){
							const current = matrix.find(p=>p.value === e.target.category)
							if(current.pair[0] === current.pair[1])
							{
							
								return false;
							} else {
								return true;
							}
						},
						drop: function (e) {
							const current = matrix.find(p=>p.value === e.target.category)
							const localMatrix = JSON.parse(JSON.stringify(matrix));
							if(current.pair[0] === current.pair[1])
							{return false;
							} else {
								localMatrix.find(p=>p.value === e.target.category).priority = Math.round(e.newPoint.y);
								setMatrix([...localMatrix]);
								return true;
							}
							
						}
					}
				},
				stickyTracking: false,
				dragDrop: {
					draggableY: true, 

		  dragMinY: 0,
		  dragMaxY: 10,
				},
			},
			line: {
				cursor: 'ns-resize'
			}
		},
	  }
	const handleGoalChange = (goal) => {
		setGoal(goal);
		setSelectedCriteria([]);
		setMatrix([]);
	}
	const handleCriteriaChange = (e) => {
		const criteria = goal.criteria_factors.filter(c=> e.indexOf(c.value)>-1);
		//if(e.currentTarget.checked){
			setSelectedCriteria([...criteria]);
		// } else{
		// 	setSelectedCriteria([...selectedCriteria.filter(c => c !== criteria)]);
		// }
	}
	useEffect(() => {
		if(selectedCriteria.length>1) {
			const tbl = [];
			selectedCriteria.forEach((c,index)=>{
				
				selectedCriteria.forEach((cf,childIndex)=>{
					if(childIndex>=index){
						if(index === childIndex) {
							tbl.push({label:c.label +' VS '+ cf.label,value:c.value +' VS '+ cf.value,pair: [index,childIndex],priority:1});
						} else {
							tbl.push({label:c.label +' VS '+ cf.label,value:c.value +' VS '+ cf.value,pair: [index,childIndex],priority:cf.priority});
						}
					}
					
				})
			})
			setMatrix(tbl);
		}
	},[selectedCriteria]);
	const calculatePairwise = (i,j) => {
		if(matrix.find(p=>p.pair[0] === i && p.pair[1] === j)) {
			return (matrix.find(p=>p.pair[0] === i && p.pair[1] === j).priority).toFixed(2);
		} else if(matrix.find(p=>p.pair[0] === j && p.pair[1] === i)) {
			return (1/matrix.find(p=>p.pair[0] === j && p.pair[1] === i).priority).toFixed(2);
		} else {
			return 'N/A';
		}
	}
	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;
	const MenuProps = {
	PaperProps: {
		style: {
		maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
		width: 250,
		},
	},
	};
	const makeDictonary = ()=> {
		const dict = {};
		setLoading(true);
		try {
			selectedCriteria.forEach((c, i)=>{
				selectedCriteria.forEach((d,j)=>{
					dict[c.key + ',' + d.key] = calculatePairwise(i,j);
				});
			})
			let geoprocessor = new Geoprocessor({
				id:'suitability',
				title:'Suitability',
				url: "http://3d.guamgis.com/arcgis/rest/services/FinalAHP/GPServer/AHP%20Final%20Script",
				outSpatialReference: SpatialReference.WebMercator
			  });
			  setJobStatus('Submitting Job');
			  geoprocessor.submitJob({input: JSON.stringify(dict),output:''}).then(function(jobInfo) {
				let jobid = jobInfo.jobId;
			  
				let options = {
				  interval: 1500,
				  statusCallback: function(j) {
					  console.log(j.jobStatus);
					  setJobStatus(j.jobStatus);
				  },
				
				};
			  
				geoprocessor.waitForJobCompletion(jobid, options).then(function() {
					var hideLayer = view.map.layers.flatten(function(item){
						return item.layers || item.sublayers;
					  }).find(function(layer){
						return layer.title === "FinalAHP";
					  });
					  if(hideLayer != null) {
						view.map.remove(hideLayer);
					  }
					let layer = geoprocessor.getResultMapImageLayer(jobid);
					  view.map.add(layer);
					setLoading(false);
				  
				});
			  });
		} catch (error) {
			console.log(error);
			setLoading(false);
			setJobStatus('');
		}
		
		//console.log(dict);
	}
	return <Container maxWidth="xl">
		  <h1>Select Your Goal</h1>
		  {goals[0].options.map(g => {
				return <FormControlLabel
				control={
				<Radio checked={g.value === goal.value}  name={g.value} onChange={(e)=>{ handleGoalChange(g)  }} />
				}
				label={g.value}
				/>
		  })}
		  {goal.criteria_factors.length>0 &&
		  <Box>
		  <h2>Select Criteria Fector</h2>
		  <FormControl sx={{ m: 1,width: 600 }}>
        <InputLabel id="demo-multiple-checkbox-label">Select Criteria Fector</InputLabel>
		  <Select 
		  multiple
		  value={selectedCriteria.map(c=>c.value)}
		  input={<OutlinedInput label="Tag" />}
		  onChange={(e)=>{handleCriteriaChange(e.target.value)}}
          MenuProps={MenuProps}
		  renderValue={(selected) => selected.join(', ')}

    >
		   {goal.criteria_factors.map(item=>{
			   const selected = selectedCriteria.find(c => c.value === item.value);
			return  <MenuItem key={item.value} value={item.value} >
			<Checkbox checked={selected?true:false} />
			<ListItemText primary={item.value} />
			</MenuItem>
		})}
		</Select>
		</FormControl>
		</Box>
		  }
	      {selectedCriteria.length>2  &&
			<HighchartsReact 
			highcharts={Highcharts}
			options={options}
			/>
		  }
		  {selectedCriteria.length>2 &&
			<Box>
				<h2>Pairwise Matrix <Button onClick={()=>{makeDictonary()}} > {loading === true ?jobStatus:'Plot On Map'}</Button></h2>
				<TableContainer component={Paper}>
					<Table aria-label="simple table" size="small">
						<TableHead>
							<TableRow>
								<TableCell component="th" scope="row">Criteria</TableCell>
								{selectedCriteria.map((row,index) => {
								return <TableCell component="th" >{row.value}</TableCell>
							})}
							</TableRow>
						</TableHead>
						<TableBody>
							{selectedCriteria.map((row,index) => {
								return <TableRow key={index}>
									<TableCell component="th" scope="row" >{row.value}</TableCell>
									{selectedCriteria.map((d,k) => {
										return <TableCell>{calculatePairwise(index,k)}</TableCell>
									})}
								</TableRow>
							})}
						</TableBody>
						</Table>
					</TableContainer>
				
			</Box>
		  }
		  
	</Container> 

// 

}
export default SuitabilityAnalysis;