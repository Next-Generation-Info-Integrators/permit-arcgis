import React, { useEffect } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import draggable from "highcharts/modules/draggable-points";
import more from "highcharts/highcharts-more";
import { Button, Checkbox, Container, FormControl, FormControlLabel, InputLabel, ListItemText, makeStyles, MenuItem, OutlinedInput, Paper, Radio, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Box } from '@mui/system';
import Geoprocessor from '@arcgis/core/tasks/Geoprocessor';
import SpatialReference from '@arcgis/core/geometry/SpatialReference';


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
	const goals = React.useMemo(()=>([{label: 'What are your goals?' , options:[
			{label:'Residential areas', value:'Residential',criteria_factors: [
				{label:'Residential areas should be safe from frequent floods, important for years to coe', value:'Flood Risk',key:'Flood_Final' ,priority: 1},
				{label:'How accessible are main roads from the property, so that emergency services reach faster', value:'Distance from Main Road',key:'Main_Road_Points' ,priority: 3},
				{label: 'Fire safety', value:'Distance from fire station',key:'Fire_Stations' ,priority: 1},
				{label: 'Emergency/Primary medical services', value:'Distance from medicos / hospital',key:'Hospitals' ,priority: 1},
				{label: 'Places for recreation, relaxation, exercise within reach', value:'Distance from neighborhood park',key:'Parks' ,priority: 3},
				{label: 'Elementary schools within walking distances from homes', value:'Distance from elementary school',key:'Schools' ,priority: 4},
				{label: 'Presence of a neighborhood grocery store, solves fresh food access', value:'Distance of grocery store/supermarket (food security/fresh food access)',key:'Shopping_Centers' ,priority: 6},
				{label: 'The new development increasing housing supply, decreasing housing prices is a welcome change', value:'High rent area',key:'Flood_Final' ,priority: 9},
				{label: 'Flat areas, more safer for home building than those on hills, more prone to widfires, landslides', value:'Slope',key:'Slope_sample' ,priority: 2},
			]},
			{label:'Commercial areas', value:'Commercial',criteria_factors: [
				{label:'Commercial areas located close to residential areas get a market. Reduces driving distances and keeps areas lively for most hours a day', value:'Distance from Residential areas',key: 'Residential' ,priority: 1},
				{label:'Important if most things for daily consumption are imported', value:'Distance from Terminal/Ports',key:'Airports_Marinas' ,priority: 2},
				{label: 'Emergency/Primary medical services', value:'Distance from main roads',key:'Main_Road_Points' ,priority: 1},
			]},
			{label:'Industrial areas', value:'Industrial',criteria_factors: [
				{label:'Industries require large parcels of flat lands', value:'Slope' ,priority: 2,key: 'Slope_sample'},
				{label:'Industrial areas affect quality of air, noise etc. Far is better', value:'Distance from Residential Areas' ,priority: 1,key: 'Residential'},
				{label: 'Better accessibility a plus for loading/unloading etc', value:'Distance from main roads' ,priority: .50,key: 'Main_Road_Points'},
				{label: 'Industries near the ports are better, easy access to export services ', value:'Distance from ports' ,priority: 3.03,key:'Airports_Marinas'},
			]},
			// {label:'Hotal/Resort', value:'Hotal',criteria_factors: [
			// 	{label:'Hotels drive a lot of vehicular traffic, noise etc. which should be distanced form the residential environment', value:'Distance from Residential areas' ,priority: 3,key: 'Residential'},
			// 	{label:'Distance to airport is a factor for Hotels, not so much for Resorts', value:'Distance from Airport/Sea port' ,priority: 2,key:'Airports_Marinas'},
			// 	{label: 'To facillitate easy movement for cab traffic, service vehicles, waste collection etc.', value:'Distance from main roads' ,priority: 1,key: 'Main_Road_Points'},
			// 	{label: 'Tourism has footprints on the ecology of sensitive areas. Factor to be considered so that mitigations can be made accordingly', value:'Distance from ecologically sensitive areas' ,priority: .50},
			// ]},
			// {label:'Public Facility/School Zone', value:'Facility',criteria_factors: [
			// 	{label:'Hotels drive a lot of vehicular traffic, noise etc. which should be distanced form the residential environment', value:'Distance from Residential areas' ,priority: 3},
			// 	{label:'Distance to airport is a factor for Hotels, not so much for Resorts', value:'Number of households served within half mile radius' ,priority: 2},
			// 	{label: 'To facillitate easy movement for cab traffic, service vehicles, waste collection etc.', value:'Slope' ,priority: 1},
			// 	{label: 'Tourism has footprints on the ecology of sensitive areas. Factor to be considered so that mitigations can be made accordingly', value:'Elevation of the site wrt surroundings' ,priority: .50},
			// 	{label: '',value:'Flood lines',priority:0},
			// 	{label: '',value:'Distance from Highways',priority:0},
			// 	{label: '',value:'Number of adult use shops around (vape, movies, bars)',priority:0},
			// 	{label: '',value:'',priority:0},
			// ]},
		]
	}]),[]);
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
		console.log(goal);
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
			  
			  geoprocessor.submitJob({input: JSON.stringify(dict),output:''}).then(function(jobInfo) {
				let jobid = jobInfo.jobId;
			  
				let options = {
				  interval: 1500,
				  statusCallback: function(j) {
					  setJobStatus(j.jobStatus);
				  }
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