import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';

const MeasureSwitch = ({measurementTool,view})=>{

	const [activeTool,setActiveTool] = useState('');
	useEffect(()=>{
		if(!measurementTool)
			return;
		measurementTool.activeTool = (view.type.toUpperCase() === '3D' && activeTool === 'distance') ? 'direct-line': activeTool;
	},[measurementTool, activeTool])

	useEffect(()=>{
		if(!view)
			return;
		view.ui.add([measurementTool],'top-right');
	},[view])
	return (<ToggleButtonGroup
		orientation="horizontal" 
		size="small"
		color="primary"
		value={activeTool}
		exclusive
		 style={{backgroundColor:'#fff'}}
		onChange={(event, newValue) => { console.log(newValue); setActiveTool(newValue); }}
	  >
		<ToggleButton value="distance"  aria-label="distance">
		  <span className="esri-widget--button esri-interactive esri-icon-measure-line" size="small"></span>
		</ToggleButton>
		<ToggleButton value="area"  aria-label="area">
			<span className="esri-widget--button esri-interactive esri-icon-measure-area" size="small"></span>
		</ToggleButton>
		<ToggleButton value="clear"  aria-label="clear">
			<span className="esri-widget--button esri-interactive esri-icon-trash" size="small"></span>
		</ToggleButton>
	  </ToggleButtonGroup>)
}

export default MeasureSwitch;