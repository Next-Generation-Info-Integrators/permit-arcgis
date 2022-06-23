import { Button, Card, CardContent, CardHeader, CardMedia, Grid, Icon, Input, Paper, Slider, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import { Chart } from "react-google-charts";
import { Box } from '@mui/system';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

const polySym = {
	type: "simple-fill", // autocasts as new SimpleFillSymbol()
	color: [140, 140, 222, 0.5],
	outline: {
	  color: [0, 0, 0, 0.5],
	  width: 2
	}
  };

  const pointSym = {
	type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
	color: [255, 0, 0],
	outline: {
	  color: [255, 255, 255],
	  width: 1
	},
	size: 7
  };

class IdentifyComponent extends React.Component {

	constructor(props)
	{
		super(props);
		this.resultDiv  = React.createRef();
		this.bufferLayer = new GraphicsLayer({title:'Buffer Layer',listMode:'hide'});
		this.pointLayer = new GraphicsLayer({title:'Point Layer',listMode:'hide'});
		this.featureLayer = new FeatureLayer({url: 'http://insight.eblpguam.com/arcgis/rest/services/permit/MapServer/8'});
		this.state = {
			activeTool: 'clear',
			bufferValue: 500,
			mapEvent: null,
			queryResults: {features:null,dt: new Date()},
			data: [],
			clickHandler: null,
			layerLoaded: false
		}
	}

	componentDidMount() {
		const curobj = this;
		curobj.props.view.when((view) => {
			if(curobj.state.layerLoaded === false){
				curobj.setState({layerLoaded: true},()=>{
					curobj.view = view;
					curobj.addLayer();
					curobj.view.ui.add([curobj.resultDiv.current], 'top-right');
		})
	}
		
		})
	}
	componentDidUpdate(prevProps, prevState) {

		if(this.state.activeTool !== prevState.activeTool){
			this.handleActiveToolChange();
		}
		if(this.state.mapEvent !== prevState.mapEvent || this.state.bufferValue !== prevState.bufferValue){
			this.executeIdentify(this.state.mapEvent);
		}
		if(this.props.closed !== prevProps.closed && this.props.closed === true){
			this.clearGraphics();
			this.view.ui.remove(this.resultDiv.current);
			this.view.map.removeMany([this.bufferLayer, this.pointLayer]);
			this.setState({data:[]});
		}
	}
	componentWillUnmount() {
		this.view.ui.remove(this.resultDiv.current);
		this.view.map.removeMany([this.bufferLayer, this.pointLayer]);
		this.setState({data:[]});

	}
	
	handleActiveToolChange =()=>{
		const { activeTool } = this.state;
		let handler = null;
		if(this.state.clickHandler){
			this.state.clickHandler.remove();
			this.setState({clickHandler: null});
		}
		if(activeTool === 'point') {
			handler = this.view.on("click", (event)=> {
				this.setState({mapEvent: event});
			});
		} else if(activeTool === 'polygon') {
			handler = this.view.on("click", (event)=> {
				this.setState({mapEvent: event});
			});
		} 
		this.setState({clickHandler: handler});
	};
	addLayer = ()=>{
			this.view.map.addMany([this.bufferLayer, this.pointLayer]);	
	
	};
	handleSearchResult =()=>{
		const { queryResults } = this.state;
		if(!queryResults.features)
			return;
		const newData =[];
		newData.push(["Category", "Count"]);
		queryResults.features.forEach(feature=>{
			newData.push([feature.LandUseZone, feature.count]);
		})
		this.setState({data: newData});
		if(newData.length > 1){
			this.view.ui.add([this.resultDiv.current], "top-right");
		} else {
			this.view.ui.remove(this.resultDiv.current);
		}
	}
 executeIdentify =(event) => {
		if(!event || !event.mapPoint)
			return;
		this.bufferPoint(event.mapPoint);
		const query = this.featureLayer.createQuery();

		
		let landuseZoneCount = {
			onStatisticField: "LandUseZone",  // service field for 2015 population
			outStatisticFieldName: "count",
			statisticType: "count"
		  };
		query.outStatistics = [ landuseZoneCount];
		query.outFields= ["LandUseZone_count","count"];
		query.groupByFieldsForStatistics = ["LandUseZone"];
		query.geometry = this.view.toMap(event);  // the point location of the pointer
		query.distance = this.state.bufferValue;
		query.units = "feet";
		query.spatialRelationship = "intersects";  // this is the default
		query.returnGeometry = false;
		this.featureLayer.queryFeatures(query)
		.then((response)=>{
			 const newResults = response.features.map(p=>p.attributes);
			this.setState({ queryResults:{ features:newResults,dt: new Date()} } ,()=>{
				this.handleSearchResult();
			});
		});
		
	} 
	

	  /**
	   * Buffers the given point by 560 kilometers.
	   *
	   * @param {esri/geometry/Point} point - A point instance to buffer.
	   */
	   bufferPoint=(point)=> {
		
		this.clearGraphics();

		// removes z-values from the point when taken from a SceneView.
		// GeometryEngine does not support 3D geometries.
		point.hasZ = false;
		point.z = undefined;

		this.pointLayer.add(
		  new Graphic({
			geometry: point,
			symbol: pointSym
		  })
		);


		const buffer = geometryEngine.geodesicBuffer(point, this.state.bufferValue, "feet");
		this.bufferLayer.add(
		  new Graphic({
			geometry: buffer,
			symbol: polySym
		  })
		);
	  }

	  /**
	   * Clears all graphics from all GraphicsLayers
	   */
	   clearGraphics=()=> {
		this.pointLayer.removeAll();
		this.bufferLayer.removeAll();
	  }

   handleSliderChange = (event, newValue) => {
    this.setState({bufferValue: newValue});
  };

   handleInputChange = (event) => {
    this.setState({bufferValue: (event.target.value === '' ? '' : Number(event.target.value))});
  };

   handleBlur = () => {
	   const { bufferValue } = this.state;
    if (bufferValue < 0) {
		this.setState({bufferValue: 0});
    } else if (bufferValue > 5000) {
		this.setState({bufferValue: 5000});
    }
  };
	render() 
	{
		const {activeTool, bufferValue, queryResults, data} = this.state;
		return (
		<>
		<Box sx={{ width: 250 }} style={{backgroundColor:'#fff'}}>

	<ToggleButtonGroup
		orientation="horizontal" 
		size="small"
		color="primary"
		value={activeTool}
		exclusive
		onChange={(event, newValue) => { this.setState({activeTool: newValue}); }}
	  >
		{/* <ToggleButton value="polygon"  aria-label="polygon">
		  <span className="esri-widget--button esri-interactive esri-icon-measure-line" size="small"></span>
		</ToggleButton> */}
		
		<ToggleButton value="point"  aria-label="point">
			<RadioButtonUncheckedRoundedIcon />
		</ToggleButton>
		<ToggleButton value="clear"  aria-label="clear">
			<DeleteForeverRoundedIcon/>
		</ToggleButton>
	  </ToggleButtonGroup>
	  <hr/>
      <Typography id="input-slider" gutterBottom>
        Buffer
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <RadioButtonCheckedIcon />
        </Grid>
        <Grid item xs>
          <Slider max={5000}
            value={typeof bufferValue === 'number' ? bufferValue : 0}
            onChange={this.handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid item>
          <Input
            value={bufferValue}
            size="small"
            onChange={this.handleInputChange}
            onBlur={this.handleBlur}
            inputProps={{
              min: 100,
              max: 5000,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
	  <div id="resultDiv" ref={this.resultDiv} class="esri-widget" >
      {queryResults.features && queryResults.features.length > 0 &&

	  <Card variant='elevation' sx={{minWidth:'500px',height:'400px'}}>
		  <CardHeader title="Landuse Analysis" subheader={`No Of Parcel - ${queryResults.features && queryResults.features.map(d=>d.count).reduce((partialSum, a) => partialSum + a, 0)}`} />
		  <CardMedia >
			  
		<Chart
  chartType="PieChart"
  data={data}
  width="100%"
  height="250px"
  legendToggle ={true}
  options={{
	legend: {position:'bottom'},
		title: "Land use Zone",
		is3D: false,
		pieHole: 0.5,
		sliceVisibilityThreshold: 0.01,
	  
  }}
/>
		  </CardMedia>
		
	  </Card>
		}
    </div>
	  </>
	  )
	}
}
export default IdentifyComponent;