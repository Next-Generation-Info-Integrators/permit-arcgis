import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import React, { createRef, useEffect, useMemo, useRef, useState } from 'react';
import SketchViewModel from '@arcgis/core/widgets/Sketch/SketchViewModel';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Slider from '@arcgis/core/widgets/Slider';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import * as promiseUtils from '@arcgis/core/core/promiseUtils';
import Graphic from '@arcgis/core/Graphic';
import {Chart} from 'chart.js';

// Set the renderer with objectIds
let highlightHandle = null;
const IdentifyParcel = ({view})=>{

	const [activeTool,setActiveTool] = useState('point');
	const [sketchGeometry,setSketchGeometry] = useState(null);
	const [sketchViewModel,setSketchViewModel] = useState(null);
	const [bufferSize,setBufferSize] = useState(0);
	const [parcelLayer, setParcelLayer] = useState(null);
	const bufferNumNode = useRef(null);
	const bufferLayer = useMemo(()=>{
		return new GraphicsLayer()
	},[]);
	const sketchLayer = useMemo(()=>{
		return new GraphicsLayer();
	},[])
	const queryDiv = createRef();
	const resultDiv = createRef();
	const yearCanvas = createRef();
	const materialCanvas = createRef();
	// set the geometry query on the visible SceneLayerView
	const debouncedRunQuery = promiseUtils.debounce(() => {
		if (!sketchGeometry) {
		  return;
		}

		resultDiv.current.style.display = "block";
		updateBufferGraphic(bufferSize);
		return promiseUtils.eachAlways([
		  queryStatistics(),
		  updateSceneLayer()
		]);
	  });

	// Clear the geometry and set the default renderer
	function clearGeometry() {
		setSketchGeometry(null);
		sketchViewModel.cancel();
		sketchLayer.removeAll();
		bufferLayer.removeAll();
		clearHighlighting();
		clearCharts();
		resultDiv.current.style.display = "none";
	  }
	  function runQuery() {
		debouncedRunQuery().catch((error) => {
		  if (error.name === "AbortError") {
			return;
		  }

		  console.error(error);
		});
	  }

	  
	  function clearHighlighting() {
		if (highlightHandle) {
		  highlightHandle.remove();
		  highlightHandle = null;
		}
	  }

	  function highlightBuildings(objectIds) {
		// Remove any previous highlighting
		clearHighlighting();
		const objectIdField = parcelLayer.objectIdField;
		document.getElementById("count").innerHTML = objectIds.length;

		highlightHandle = view.highlight(objectIds);
	  }

	  // update the graphic with buffer
	  function updateBufferGraphic(buffer) {
		// add a polygon graphic for the buffer
		if (buffer > 0) {
		  const bufferGeometry = geometryEngine.geodesicBuffer(
			sketchGeometry,
			buffer,
			"meters"
		  );
		  if (bufferLayer.graphics.length === 0) {
			bufferLayer.add(
			  new Graphic({
				geometry: bufferGeometry,
				symbol: sketchViewModel.polygonSymbol
			  })
			);
		  } else {
			bufferLayer.graphics.getItemAt(0).geometry = bufferGeometry;
		  }
		} else {
		  bufferLayer.removeAll();
		}
	  }

	  function updateSceneLayer() {
		const query = view.createQuery();
		query.geometry = sketchGeometry;
		query.distance = bufferSize;
		return view.queryObjectIds(query).then(highlightBuildings);
	  }

	  let yearChart = null;
	  let materialChart = null;

	  function queryStatistics() {
		const statDefinitions = [
		  {
			onStatisticField:
			  "CASE WHEN buildingMaterial = 'concrete or lightweight concrete' THEN 1 ELSE 0 END",
			outStatisticFieldName: "material_concrete",
			statisticType: "sum"
		  },
		  {
			onStatisticField:
			  "CASE WHEN buildingMaterial = 'brick' THEN 1 ELSE 0 END",
			outStatisticFieldName: "material_brick",
			statisticType: "sum"
		  },
		  {
			onStatisticField:
			  "CASE WHEN buildingMaterial = 'wood' THEN 1 ELSE 0 END",
			outStatisticFieldName: "material_wood",
			statisticType: "sum"
		  },
		  {
			onStatisticField:
			  "CASE WHEN buildingMaterial = 'steel' THEN 1 ELSE 0 END",
			outStatisticFieldName: "material_steel",
			statisticType: "sum"
		  },
		  {
			onStatisticField:
			  "CASE WHEN buildingMaterial IN ('concrete or lightweight concrete', 'brick', 'wood', 'steel') THEN 0 ELSE 1 END",
			outStatisticFieldName: "material_other",
			statisticType: "sum"
		  },
		  {
			onStatisticField:
			  "CASE WHEN (yearCompleted >= '1850' AND yearCompleted <= '1899') THEN 1 ELSE 0 END",
			outStatisticFieldName: "year_1850",
			statisticType: "sum"
		  },
		  {
			onStatisticField:
			  "CASE WHEN (yearCompleted >= '1900' AND yearCompleted <= '1924') THEN 1 ELSE 0 END",
			outStatisticFieldName: "year_1900",
			statisticType: "sum"
		  },
		  {
			onStatisticField:
			  "CASE WHEN (yearCompleted >= '1925' AND yearCompleted <= '1949') THEN 1 ELSE 0 END",
			outStatisticFieldName: "year_1925",
			statisticType: "sum"
		  },
		  {
			onStatisticField:
			  "CASE WHEN (yearCompleted >= '1950' AND yearCompleted <= '1974') THEN 1 ELSE 0 END",
			outStatisticFieldName: "year_1950",
			statisticType: "sum"
		  },
		  {
			onStatisticField:
			  "CASE WHEN (yearCompleted >= '1975' AND yearCompleted <= '1999') THEN 1 ELSE 0 END",
			outStatisticFieldName: "year_1975",
			statisticType: "sum"
		  },
		  {
			onStatisticField:
			  "CASE WHEN (yearCompleted >= '2000' AND yearCompleted <= '2015') THEN 1 ELSE 0 END",
			outStatisticFieldName: "year_2000",
			statisticType: "sum"
		  }
		];
		const query = view.createQuery();
		query.geometry = sketchGeometry;
		query.distance = bufferSize;
		query.outStatistics = statDefinitions;

		return view.queryFeatures(query).then((result) => {
		  const allStats = result.features[0].attributes;
		  updateChart(materialChart, [
			allStats.material_concrete,
			allStats.material_brick,
			allStats.material_wood,
			allStats.material_steel,
			allStats.material_other
		  ]);
		  updateChart(yearChart, [
			allStats.year_1850,
			allStats.year_1900,
			allStats.year_1925,
			allStats.year_1950,
			allStats.year_1975,
			allStats.year_2000
		  ]);
		}, console.error);
	  }

	  // Updates the given chart with new data
	  function updateChart(chart, dataValues) {
		// chart.data.datasets[0].data = dataValues;
		// chart.update();
	  }

	  function createYearChart() {
		const yearCanvas = document.getElementById("year-chart");
		yearChart = new Chart(yearCanvas.getContext("2d"), {
		  type: "horizontalBar",
		  data: {
			labels: [
			  "1850-1899",
			  "1900-1924",
			  "1925-1949",
			  "1950-1974",
			  "1975-1999",
			  "2000-2015"
			],
			datasets: [
			  {
				label: "Plan year",
				backgroundColor: "#149dcf",
				stack: "Stack 0",
				data: [0, 0, 0, 0, 0, 0]
			  }
			]
		  },
		  options: {
			responsive: false,
			legend: {
			  display: false
			},
			title: {
			  display: true,
			  text: "Build year"
			},
			scales: {
			  xAxes: [
				{
				  stacked: true,
				  ticks: {
					beginAtZero: true,
					precision: 0
				  }
				}
			  ],
			  yAxes: [
				{
				  stacked: true
				}
			  ]
			}
		  }
		});
	  }
	  function createMaterialChart() {
		const materialCanvas = document.getElementById("material-chart");
		materialChart = new Chart(materialCanvas.getContext("2d"), {
		  type: "doughnut",
		  data: {
			labels: ["Concrete", "Brick", "Wood", "Steel", "Other"],
			datasets: [
			  {
				backgroundColor: [
				  "#FD7F6F",
				  "#7EB0D5",
				  "#B2E061",
				  "#BD7EBE",
				  "#FFB55A"
				],
				borderWidth: 0,
				data: [0, 0, 0, 0, 0]
			  }
			]
		  },
		  options: {
			responsive: false,
			cutoutPercentage: 35,
			legend: {
			  position: "bottom"
			},
			title: {
			  display: true,
			  text: "Building Material"
			}
		  }
		});
	  }

	  function clearCharts() {
		updateChart(materialChart, [0, 0, 0, 0, 0]);
		updateChart(yearChart, [0, 0, 0, 0, 0, 0]);
		// document.getElementById("count").innerHTML = 0;
	  }

	useEffect(()=>{
		if(!sketchViewModel)
			return;
		clearGeometry();
		sketchViewModel.create(activeTool);
	},[activeTool, sketchViewModel])
	useEffect(()=>{
		if(!sketchViewModel)
			return;
		sketchViewModel.on("create", (event) => {
			if (event.state === "complete") {
				setSketchGeometry(event.graphic.geometry);
				runQuery();
			}
			});
	
			sketchViewModel.on("update", (event) => {
			if (event.state === "complete") {
				setSketchGeometry(event.graphics[0].geometry);
				runQuery();
			}
			});
	},[sketchViewModel])
	useEffect(()=>{
		if(!view)
			return;
		const sketchLayer = new GraphicsLayer();
		const bufferLayer = new GraphicsLayer();
		view.map.addMany([bufferLayer, sketchLayer]);
        const parcelLyr = view.map.layers.find(layer => layer.title === "Parcels");
		if(parcelLyr)
			setParcelLayer(parcelLyr);
		// use SketchViewModel to draw polygons that are used as a query
        setSketchViewModel( new SketchViewModel({
          layer: sketchLayer,
          defaultUpdateOptions: {
            tool: "reshape",
            toggleToolOnClick: false
          },
          view: view,
          defaultCreateOptions: { hasZ: false }
        }))
  
		  
		  // createYearChart();
		  // createMaterialChart();
	
	},[view])
	useEffect(()=>{
		if(!bufferNumNode || !view)
			return;
		const bufferNumSlider = new Slider({
			container: bufferNumNode.current.target,
			min: 0,
			max: 500,
			steps: 1,
			visibleElements: {
			  labels: true
			},
			precision: 0,
			labelFormatFunction: (value, type) => {
			  return `${value.toString()}m`;
			},
			values: [0]
		  });
		  // get user entered values for buffer
		  bufferNumSlider.on(
			["thumb-change", "thumb-drag"],
			bufferVariablesChanged
		  );
		  function bufferVariablesChanged(event) {
			 setBufferSize(event.value);
			// runQuery();
		  }
	},[bufferNumNode,])
	return (<div style={{padding:'20px'}}>
	<div id="queryDiv" className="esri-widget">
      <b>Query by geometry</b><br />
      <br />Draw a geometry to query by:
      <ToggleButtonGroup
		orientation="horizontal" 
		size="small"
		color="primary"
		value={activeTool}
		exclusive
		 style={{backgroundColor:'#fff'}}
		onChange={(event, newValue) => {  setActiveTool(newValue); }}
	  >
		<ToggleButton value="point"  aria-label="point">
		  <span className="esri-widget--button esri-interactive esri-icon-point" size="small"></span>
		</ToggleButton>
		<ToggleButton value="polyline"  aria-label="polyline">
			<span className="esri-widget--button esri-interactive esri-icon-polyline" size="small"></span>
		</ToggleButton>
		<ToggleButton value="polygon"  aria-label="polygon">
			<span className="esri-widget--button esri-interactive esri-icon-polygon" size="small"></span>
		</ToggleButton>
		<ToggleButton value="clear"  aria-label="clear">
			<span className="esri-widget--button esri-interactive esri-icon-trash" size="small"></span>
		</ToggleButton>
	  </ToggleButtonGroup>
      <br />
      <div className="tooltip">
        <label for="bufferNum">Set a geometry buffer size:</label>
        <div id="bufferNum" ref={bufferNumNode}></div>
      </div>
    </div>

    <div ref={resultDiv} id="resultDiv" className="esri-widget">
      <div className="count">
        Selected Parcels:
        <div className="count" id="count">0</div>
      </div>
      <div className="charts">
        <div>
          <canvas ref={yearCanvas} id="year-chart" height="250" width="260" />
        </div>
        <div>
          <canvas ref={materialCanvas} id="material-chart" width="250" height="300" />
        </div>
      </div>
    </div>
	</div>)
}

export default IdentifyParcel;