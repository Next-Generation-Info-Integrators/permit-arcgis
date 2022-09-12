import { useContext, useEffect, useMemo, useState } from "react";
import esriMapContext from "../../esriMapcontext";
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import model from '../../assets/HagatnaView.glb';
const HagatnaView = ({}) => {

  const { mapView, activeView, sceneView } = useContext(esriMapContext);
  const loadHagtnaView= () => {
	const graphic = new Graphic({
		geometry: {
			type: "point", // autocasts as new Point()
			latitude: 13.478095,
			longitude: 144.752468,
			z: 100,
		  },///144.753012°‎, 13.478707°‎
		  //144.752468°‎, 13.478095°‎
		symbol: {
			type: "point-3d",
			symbolLayers: [
			  {
				type: "object",
				// height: 10,
				resource: {
				  href: model
				}
			  }
			]
		  },
	  });
	const graphicLayer = new GraphicsLayer({title:'Hagatna View 3D',
	elevationInfo: {
		mode: "on-the-ground"
	},
	graphics:[
		graphic
	]
  });
 
	//activeView.when(() => {
		
		graphicLayer.when(() => {

			setTimeout(() => {
				const cam = activeView.camera.clone();
				// the position is autocast as new Point()
				console.log(activeView.center);
				cam.position = [144.752609, 13.478390, 682.98652]; ///[lon,lat]
				cam.heading = 53.86;
				cam.tilt = 45.45;
				// go to the new camera
				activeView.goTo(cam);
			}, 2000);
		
	});
	activeView.map.add(graphicLayer);
  }
  useEffect(()=>{
	  if(!activeView )
		  return;
		const foundLayer = activeView.map.allLayers.find(function(layer) {
			return layer.title === "Hagatna View 3D";
		   });
		if(foundLayer) {
			return;
		}
		if(activeView.type.toUpperCase() === '3D'){
			loadHagtnaView(); 
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
export default HagatnaView;