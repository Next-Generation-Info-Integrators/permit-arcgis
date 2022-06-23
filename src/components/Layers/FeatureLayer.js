import { useContext, useEffect, useMemo, useState } from "react";
import esriMapContext from "../../esriMapcontext";
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";

function getSymbol(color) {
	return {
	  type: "polygon-3d", // autocasts as new PolygonSymbol3D()
	  symbolLayers: [
		{
		  type: "extrude", // autocasts as new ExtrudeSymbol3DLayer()
		  material: {
			color: color
		  },
		  edges: {
			type: "solid",
			color: "#999",
			size: 0.5
		  }
		}
	  ]
	};
  }
  function getSymbol2d(color) {
	return {
		type: "simple-fill",  // autocasts as new SimpleRenderer()
		color: color
	};
  }
  const renderer = {
	type: "unique-value", // autocasts as new UniqueValueRenderer()
	defaultSymbol: getSymbol("#FFFFFF"),
	defaultLabel: "Other",
	field: "Type",
	uniqueValueInfos: [
	  {
		value: "APT",
		symbol: getSymbol("#A7C636"),
		label: "APT"
	  },
	  {
		value: "H",
		symbol: getSymbol("#FC921F"),
		label: "H"
	  },
	  {
		value: "GOVT",
		symbol: getSymbol("#ED5151"),
		label: "GOVT"
	  },
	  {
		value: "STD",
		symbol: getSymbol("#149ECE"),
		label: "STD"
	  },
	  {
		value: "CONDO",
		symbol: getSymbol("#159ECE"),
		label: "CONDO"
	  },
	  {
		value: "C",
		symbol: getSymbol("#169ECE"),
		label: "C"
	  }
	],
	visualVariables: [
	  {
		type: "size",
		field: "HeightMete"
	  }
	]
  };
  const renderer2D = {
	type: "unique-value",  // autocasts as new UniqueValueRenderer()
  field: "Type",
  defaultSymbol: { type: "simple-fill" },  // autocasts as new SimpleFillSymbol()
  uniqueValueInfos: [
	{
		value: "APT",
		symbol: getSymbol2d("#A7C636"),
		label: "APT"
	  },
	  {
		value: "H",
		symbol: getSymbol2d("#FC921F"),
		label: "H"
	  },
	  {
		value: "GOVT",
		symbol: getSymbol2d("#ED5151"),
		label: "GOVT"
	  },
	  {
		value: "STD",
		symbol: getSymbol2d("#149ECE"),
		label: "STD"
	  },
	  {
		value: "CONDO",
		symbol: getSymbol2d("#159ECE"),
		label: "CONDO"
	  },
	  {
		value: "C",
		symbol: getSymbol2d("#169ECE"),
		label: "C"
	  }
  ],
  };
const CustomFeatureLayer = ({}) => {

  const { mapView, activeView, sceneView } = useContext(esriMapContext);
  const [url,setUrl] = useState("http://insight.eblpguam.com/arcgis/rest/services/building3d/MapServer");
  const loadFeatureLayer= () => {
	const featureLayer = new FeatureLayer({title:'Buildings 3D',
	url:url+"/0",//https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/building_footprints_height/FeatureServer
	renderer: renderer,
	elevationInfo: {
		mode: "on-the-ground"
	},
  });
 
	//activeView.when(() => {
		
	featureLayer.when(() => {
		
	});
	activeView.map.add(featureLayer);
  }
  const loadMapServiceLayer = () => {
	const layer = new MapImageLayer({
		url: url,
		title: "Buildings"
		});
	activeView.map.add(layer);
  }
  useEffect(()=>{
	  if(!activeView )
		  return;
		const foundLayer = activeView.map.allLayers.find(function(layer) {
			return layer.title === "Buildings 3D";
		   });
		if(foundLayer) {
			return;
		}
		if(activeView.type.toUpperCase() === '3D'){
			loadFeatureLayer(); 
		} else {
			// loadMapServiceLayer();
		}
	  
	  //});
  },[activeView])
 useEffect(() => {
    if (!mapView) return;
    console.log('mapView',mapView);
  }, [mapView]);
  return null;
};
export default CustomFeatureLayer;