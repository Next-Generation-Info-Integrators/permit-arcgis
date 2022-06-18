import { useContext, useEffect, useMemo, useState } from "react";
import ReactDOM  from "react-dom";
import esriMapContext from "../../esriMapcontext";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import ParcelPopup from "../Widgets/ParcelPopup";
import { SwipeableDrawer } from "@mui/material";
import SuitabilityAnalysis from "../SuitabilityAnalysis";

const BasemapDynamicLayer = ({}) => {

  const {activeView } = useContext(esriMapContext);
  const [isOpenAHP, setIsOpenAHP] = useState(false);

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
			title: "Layers",
			sublayers: [
				{
					id: 9,
					visible: true,
					title: 'Municipals',
					// popupTemplate: {
					// 	title: "Municpal - {Municplty}",
					// 	outFields: "Municplty,OBJECTID"
					// }
				},
				{
					id: 8,
					visible: true,
					title: 'Parcels',
					popupTemplate: {
						title: "Parcel - {Parcel_Search_Field}",
						content: setContentInfo,
						outFields: "*"
					}
				},
				{
					id: 6,
					visible: false,
					title: 'Buildings',
					// maxScale: 100
				},
				{
					id: 0,
					visible: false,
					// maxScale: 100,
					title: 'Streets',
				},
			]
			});
	  activeView.map.add(layer);
	
  },[activeView])
  const setContentInfo = (feature) => {
		
	const node = document.createElement('div');
	ReactDOM.render(
		<ParcelPopup data={feature.graphic} openAHPAnalysis={()=>{setIsOpenAHP(true)}} view={activeView} />
		, node);
	return node;
}
  return <SwipeableDrawer PaperProps={{
	sx: { width: "60%" },
}}
	anchor={'right'}
	open={isOpenAHP}
	onClose={() => { setIsOpenAHP(false) }}
	onOpen={() => { setIsOpenAHP(true) }}
>
	<SuitabilityAnalysis view={activeView} />
</SwipeableDrawer>;
};
export default BasemapDynamicLayer;