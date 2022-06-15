import { Paper, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Tabs, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import PropTypes  from 'prop-types';
import ParcelSuitability from './ParcelSuitability';
import * as identify from "@arcgis/core/rest/identify";
import IdentifyParameters from "@arcgis/core/rest/support/IdentifyParameters";



function TabPanel(props) {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{/* {value === index && ( */}
				<Box sx={{ div: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			{/* )} */}
		</div>
	);
}
TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}
const ParcelPopup = ({data, view,openAHPAnalysis,residentialCriteria, commercialCriteria, IndestrialCriteria})=>{

	const [tabValue, setTabValue] = useState(0);
	const [parcelScore, setParcelScore] = useState(0);

	const params = new IdentifyParameters();
          params.tolerance = 3;
          // params.layerIds = [0, 1, 2, 3, 4];
          params.layerOption = "top";
          params.width = view.width;
          params.height = view.height;
		  params.geometry = data.geometry;
          params.mapExtent = view.extent;
		  var AHPLayer = view.map.layers.flatten(function(item){
			return item.layers || item.sublayers;
		  }).find(function(layer){
			return layer.title === "FinalAHP";
		  });
		  let url = 'http://3d.guamgis.com/arcgis/rest/services/FinalAHP/MapServer';
		  if(AHPLayer != null) {
			url = AHPLayer.url;
		  } 
		  identify.identify(url,params).then(response=>{
			if(response.results != null && response.results.length>0) {
				const score =  parseFloat( response.results[0].feature.attributes["Pixel Value"]);
				setParcelScore(score);
			}
		})

	const handleTabChange =(event, newValue) => {
		setTabValue(parseInt(newValue));
	}
	const { attributes: { AppraisalStatus,
		Building_Value,
		CVGTaxCode,
		FY_No,
		FloodArea,
		HasImprovement,
		LandArea,
		LandSource,
		LandUseZone,
		LandUseZoneSource,
		Land_Value,
		LassoID,
		MUN_GIS,
		Municipal,
		Neighborhood,
		OBJECTID,
		PID,
		PIN,
		Parcel_Search_Field,
		PlanNAME,
		RecID } } = data;
	return (<Box sx={{ width: '100%' }}>
	<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
		<Tabs value={tabValue} onChange={handleTabChange} aria-label="esri popup">
			<Tab key="hpi" label="Parcel Info" {...a11yProps(0)} />
			<Tab key="hps" label="Suitability" {...a11yProps(1)} />
			{/* <Tab key="hps" label="Commercial Suitability" {...a11yProps(2)} />
			<Tab key="hps" label="Industrial Suitability" {...a11yProps(3)} /> */}
		</Tabs>
	</Box>
	<TabPanel key={"tabparcel"} value={tabValue} index={0}>
		<TableContainer component={Paper}>
			<Table size="small" sx={{ minWidth: 650 }}>

				<TableBody>
					<TableRow>
						<TableCell component={"th"}>Parcel</TableCell>
						<TableCell component={"th"} colSpan={3}>{Parcel_Search_Field}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell component={"th"}>Area</TableCell>
						<TableCell >{LandArea}</TableCell>
						<TableCell component={"th"}>Value</TableCell>
						<TableCell>{Land_Value}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell component={"th"}>PIN</TableCell>
						<TableCell >{PIN}</TableCell>
						<TableCell component={"th"}>PID</TableCell>
						<TableCell>{PID}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell component={"th"}>Survey No.</TableCell>
						<TableCell>{FY_No}</TableCell>
						<TableCell component={"th"}>Municipal</TableCell>
						<TableCell>{Municipal}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell component={"th"}>AppraisalStatus</TableCell>
						<TableCell>{AppraisalStatus}</TableCell>
						<TableCell component={"th"}>Building Value</TableCell>
						<TableCell>{Building_Value}</TableCell>
					</TableRow>
					<TableRow>
						<TableCell component={"th"}>Neighborhood</TableCell>
						<TableCell>{Neighborhood}</TableCell>
						<TableCell component={"th"}>Land Source</TableCell>
						<TableCell>{LandSource}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	</TabPanel>
	<TabPanel key="tab-analysis" value={tabValue} index={1}>
		<ParcelSuitability type="Residential" onCustomSuitability={()=>{openAHPAnalysis()}} parcelName={Parcel_Search_Field} score = {parcelScore} criteria={[
				{label:'Residential areas should be safe from frequent floods, important for years to coe', value:'Flood Risk',key:'Flood_Final' ,priority: 1,meaning:{
					'1':'AE',
					'2':'A',
					'3':'AH',
					'4':'X',
					'5':'0.2 PERCENT FLOOD ZONE ',
				}},
				{label:'How accessible are main roads from the property, so that emergency services reach faster', value:'Distance from Main Road',key:'Main_Road_Points' ,priority: 1,meaning:{
					'1':'> 1 mile',
					'2':'0.75 - 1 mile',
					'3':'0.5-0.75 mile',
					'4':'0.25-0.5 mile',
					'5':'<0.25 mile',
				}},
				{label: 'Fire safety', value:'Distance from Fire Station',key:'Fire_Stations' ,priority: 1,
				meaning:{
					'1':'> 4 miles',
					'2':'3- 4 miles',
					'3':'2- 3 miles',
					'4':'1 - 2 miles',
					'5':'< 1 mile',
				}},
				{label: 'Emergency/Primary Medical Services', value:'Distance from Medicos / Hospitals',key:'Hospitals' ,priority: 1,
				meaning:{
					'1':'> 4 miles',
					'2':'3- 4 miles',
					'3':'2- 3 miles',
					'4':'1 - 2 miles',
					'5':'< 1 mile',
				}},
				{label: 'Places for recreation, relaxation, exercise within reach', value:'Distance from Neighborhood Park',key:'Parks' ,priority: 1,meaning:{
					'1':'> 1 mile',
					'2':'0.75 - 1 mile',
					'3':'0.5-0.75 mile',
					'4':'0.25-0.5 mile',
					'5':'<0.25 mile',
				}},
				{label: 'Elementary schools within walking distances from homes', value:'Distance from Elementary School',key:'Schools' ,priority: 1,meaning:{
					'1':'> 1 mile',
					'2':'0.75 - 1 mile',
					'3':'0.5-0.75 mile',
					'4':'0.25-0.5 mile',
					'5':'<0.25 mile',
				}},
				{label: 'Flat areas, more safer for home building than those on hills, more prone to widfires, landslides', value:'Slope',key:'Slope_sample' ,priority: 1,meaning:{
					'1':'> 25 degrees',
					'2':'20 - 25 degrees',
					'3':'15 -20 degrees',
					'4':'10 - 15 degrees',
					'5':'<10 degrees',
				}},
			]}  />
	</TabPanel>
	{/* <TabPanel key="tab-analysis" value={tabValue} index={2}>
		<ParcelSuitability type="Commercial" score = {parcelScore} criteria={[
				{label:'Commercial areas located close to residential areas get a market. Reduces driving distances and keeps areas lively for most hours a day', value:'Distance from Residential areas',key: 'Residential' ,priority: 1},
				{label:'Important if most things for daily consumption are imported', value:'Distance from Terminal/Ports',key:'Airports_Marinas' ,priority: 1},
				{label: 'Emergency/Primary medical services', value:'Distance from main roads',key:'Main_Road_Points' ,priority: 1},
			]} onCustomSuitability={onCustomSuitability} />
	</TabPanel>
	<TabPanel key="tab-analysis" value={tabValue} index={3}>
		<ParcelSuitability type="Industrial" score = {parcelScore} criteria={[
				{label:'Industries require large parcels of flat lands', value:'Slope' ,priority: 2,key: 'Slope_sample'},
				{label:'Industrial areas affect quality of air, noise etc. Far is better', value:'Distance from Residential Areas' ,priority: 1,key: 'Residential'},
				{label: 'Better accessibility a plus for loading/unloading etc', value:'Distance from main roads' ,priority: .50,key: 'Main_Road_Points'},
				{label: 'Industries near the ports are better, easy access to export services ', value:'Distance from ports' ,priority: 3.03,key:'Airports_Marinas'},
			]} onCustomSuitability={onCustomSuitability} />
	</TabPanel> */}
</Box>)
}

export default ParcelPopup;