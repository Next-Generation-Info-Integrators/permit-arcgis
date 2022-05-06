import { useContext, useEffect, useMemo } from "react";
import esriMapContext from "../../esriMapcontext";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";

const BasemapDynamicLayer = ({}) => {

  const {activeView } = useContext(esriMapContext);

  useEffect(()=>{
	  if(!activeView )
		  return;
	// if(activeView.type.toUpperCase() !== '2D')
	// 	return;
		const foundLayer = activeView.map.allLayers.find(function(layer) {
		return layer.title === "Layers";
		});
		if(foundLayer) {
			return;
		}
		const layer = new MapImageLayer({
			url: "http://3d.guamgis.com/arcgis/rest/services/permit/MapServer",
			title: "Layers"
			});
	  activeView.map.add(layer);
	
  },[activeView])
  return null;
};
export default BasemapDynamicLayer;