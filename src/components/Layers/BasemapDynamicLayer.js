import { useContext, useEffect, useMemo, useState } from "react";
import ReactDOM  from "react-dom";
import esriMapContext from "../../esriMapcontext";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";
import TileLayer from "@arcgis/core/layers/TileLayer";
import ParcelPopup from "../Widgets/ParcelPopup";
import { SwipeableDrawer } from "@mui/material";
import SuitabilityAnalysis from "../SuitabilityAnalysis";
import {useAuth} from 'oidc-react';
const BasemapDynamicLayer = ({}) => {

  const {activeView } = useContext(esriMapContext);
  const [isOpenAHP, setIsOpenAHP] = useState(false);
const auth = useAuth();
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
		const layer = new TileLayer({
			url: "http://insight.eblpguam.com/arcgis/rest/services/permit/MapServer",
			title: "Layers",
			//listMode: "hide-children",
			//sublayers: [
				// {
				// 	id: 10,
				// 	visible: true,
				// 	title: 'Landmarks',
				// },
				// {
				// 	id: 9,
				// 	visible: true,
				// 	title: 'Municipals',
				// },
				// {
				// 	id: 8,
				// 	visible: true,
				// 	title: 'Parcels',
				// 	popupTemplate: {
				// 		title: "Parcel - {Parcel_Search_Field}",
				// 		content: setContentInfo,
				// 		outFields: "*"
				// 	}
				// },
				// {
				// 	id: 6,
				// 	visible: false,
				// 	title: 'Buildings',
				// 	// maxScale: 100
				// },
				// {
				// 	id: 0,
				// 	visible: false,
				// 	// maxScale: 100,
				// 	title: 'Streets',
				// },
			//]
			});
	
	  activeView.map.add(layer);
	  setTimeout(() => {
		var sublayer = layer.findSublayerById(8);
		sublayer.popupTemplate = {
			title: "Parcel - {Parcel_Search_Field}",
			content: setContentInfo,
			outFields: "*"
		};
	  }, 5000);
	  
	
  },[activeView])
  const setContentInfo = (feature) => {
	const node = document.createElement('div');
	debugger;
	ReactDOM.render(
		<ParcelPopup data={feature.graphic} authToken={auth.userData.access_token} openAHPAnalysis={()=>{setIsOpenAHP(true)}} view={activeView} />
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