import { Paper, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Tabs, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import PropTypes  from 'prop-types';
import ParcelSuitability from './ParcelSuitability';
import * as identify from "@arcgis/core/rest/identify";
import IdentifyParameters from "@arcgis/core/rest/support/IdentifyParameters";
import { suitabilityGoals } from '../../config/constants';


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
		  let url = 'http://insight.eblpguam.com/arcgis/rest/services/FinalAHP/MapServer';
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
			<Tab key="hpr" label="Residential Suitability" {...a11yProps(1)} />
			<Tab key="hpc" label="Commercial Suitability" {...a11yProps(2)} />
			<Tab key="hpid" label="Industrial Suitability" {...a11yProps(3)} />
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
	<TabPanel key="tab-res-analysis" value={tabValue} index={1}>
		<ParcelSuitability key={"rescon"} type="Residential" onCustomSuitability={()=>{openAHPAnalysis()}} parcelName={Parcel_Search_Field} score = {parcelScore} criteria={suitabilityGoals[0].options.find(p=>p.value === 'Residential').criteria_factors}  />
	</TabPanel>
	<TabPanel key="tab-com-analysis" value={tabValue} index={2}>
		<ParcelSuitability key="rescom" type="Commercial"  parcelName={Parcel_Search_Field}  score = {parcelScore} criteria={suitabilityGoals[0].options.find(p=>p.value === 'Commercial').criteria_factors} onCustomSuitability={openAHPAnalysis} />
	</TabPanel>
	<TabPanel key="tab-ind-analysis" value={tabValue} index={3}>
		<ParcelSuitability key={"resin"} type="Industrial"  parcelName={Parcel_Search_Field} score = {parcelScore} criteria={suitabilityGoals[0].options.find(p=>p.value === 'Industrial').criteria_factors} onCustomSuitability={openAHPAnalysis} />
	</TabPanel>
</Box>)
}

export default ParcelPopup;