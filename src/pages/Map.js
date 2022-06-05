import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { PropTypes } from "prop-types";
import MapView from '@arcgis/core/views/MapView';
import SceneView from '@arcgis/core/views/SceneView';
import Search from '@arcgis/core/widgets/Search';
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery';
import Bookmarks from '@arcgis/core/widgets/Bookmarks';
import Measurement from '@arcgis/core/widgets/Measurement';
import CoordinateConversion from '@arcgis/core/widgets/CoordinateConversion';
import Sketch from '@arcgis/core/widgets/Sketch';
import LayerList from '@arcgis/core/widgets/LayerList';
import Print from '@arcgis/core/widgets/Print';
import ExpandButton from '@arcgis/core/widgets/Expand';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Map from '@arcgis/core/Map';
import PopupTemplate from '@arcgis/core/PopupTemplate';
import esriMapContext from "../esriMapcontext";
import { Box, Paper, SwipeableDrawer, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import MapIcon from '@mui/icons-material/Map';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import MeasureSwitch from "../components/Widgets/MeasureSwitch";
import SuitabilityAnalysis from "../components/SuitabilityAnalysis";
import IdentifyComponent from "../components/Widgets/Identifycomponent";
import DraggableDialog from "../components/Widgets/DraggableWidget";
import LandscapeRoundedIcon from '@mui/icons-material/LandscapeRounded';
import ParcelPopup from "../components/Widgets/ParcelPopup";



// hooks allow us to create a map component as a function
function EsriMap({ children, zoom, center, show3D, visibleBaseMapGallary = false }) {
	// create a ref to element to be used as the map's container
	const mapEl = useRef(null);
	const popupEl = useRef(null);
	const [isOpenAHP, setIsOpenAHP] = useState(false);
	const [activeControl, setActiveControl] = useState('list');
	const [is3D, setIs3D] = useState(show3D);
	const [mapView, setMapView] = useState(null);
	const [sceneView, setSceneView] = useState(null);
	const [activeView, setActiveView] = useState(null);
	const [skatchLayer, setSkatchLayer] = useState(null);

	function createView(is3D) {
		let view;
		if (!is3D) {
			view = new MapView({ zoom, center,popup:{
				dockEnabled: true,
				dockOptions:{
					buttonEnabled: false,
					breakpoint:false,
				}
			} });
			
		} else {
			view = new SceneView({
				zoom, center,
				// camera: {
				// 	position: [
				// 		 center[0],center[1], 682.98652
				// 	],
				// 	tilt: 60,
				// },
				environment: {
					weather: {
						type: "cloudy",   // autocasts as new CloudyWeather(),
						cloudCover: 0.4 // cloud cover percentage
					}
				}
			});

		}
		

		return view;
	}
	const addUIControls = (view) => {
		try {

			if (view != null) {
				if (view.ui.find('basemap') !== null)
					return;
				const bookmarks = new Bookmarks({
					view: view,
					// allows bookmarks to be added, edited, or deleted
					editingEnabled: true,
					visibleElements: {
						time: false // don't show the time (h:m:s) next to the date
					}
				});
				const basemap = new BasemapGallery({
					view: view,
				});
				const coordinateConversion = new CoordinateConversion({
					view: view
				});
				const layerList = new LayerList({
					view: view,
					selectionEnabled: true,

				})

				const measurement = new Measurement({
					view: view,
					container: document.createElement('div'),
					activeTool: "none"
				});
				const skatch = new Sketch({
					view: view,
					//availableCreateTools: ["polygon", "polyline", "point"],
					layer: skatchLayer,
					creationMode: "update"
				})
				const print = new Print({
					view: view, includeDefaultTemplates: true
				})

				const bkExpand = new ExpandButton({
					view: view,
					content: bookmarks,
					expanded: false,
					expandTooltip: "Bookmarks",
				});
				const bkSkatch = new ExpandButton({
					view: view,
					content: skatch,
					expanded: false,
					expandTooltip: "Skatch",
				});
				const llExpand = new ExpandButton({
					view: view,
					content: layerList,
					expanded: false,
					expandTooltip: "Layer List",
				})
				const bkPrint = new ExpandButton({
					view: view,
					content: print,
					expanded: false,
					expandTooltip: "Print",
				});
				const bkBasemap = new ExpandButton({
					view: view,
					content: basemap,
					expanded: false,
					id: 'basemap',
					expandTooltip: "Basemap Gallery"
				});
				const mesureNode = document.createElement("div");
				ReactDOM.render(<MeasureSwitch measurementTool={measurement} view={view} />, mesureNode);
				const mesExpand = new ExpandButton({
					view: view,
					content: mesureNode,
					expanded: false,
					expandIconClass: "esri-icon-measure-area",
					expandTooltip: "Measurement"
				});
				const cocoExpand = new ExpandButton({
					view: view,
					content: coordinateConversion,
					expanded: false,
					expandTooltip: "Coordinate Conversion"
				});
				//view.when(()=>{
				view.ui.add([new Search({
					view, includeDefaultSources: false, sources: [{

						layer: new FeatureLayer({
							url: "http://3d.guamgis.com/arcgis/rest/services/permit/MapServer/8",
							outFields: ["*"],
							popupTemplate: new PopupTemplate({

								title: "Parcel Information",
								content: setContentInfo,
								
							}),
						}),
						searchFields: ["Parcel_Search_Field", "MUN_GIS"],
						displayField: "Parcel_Search_Field",
						exactMatch: false,
						outFields: ["*"],
						name: "Parcel",
						placeholder: "Search Parcels",
						maxResults: 6,
						maxSuggestions: 6,
						suggestionsEnabled: true,
						minSuggestCharacters: 0
					}]
				}), llExpand,  bkBasemap, mesExpand, cocoExpand,  bkPrint], "top-right");
				//});
			} else {
				console.log("View is null");
			}
		} catch (error) {
			console.log(error);
		}
	}
	useEffect(() => {
		setIs3D(show3D);
	}, [show3D]);

	useEffect(() => {
		try {
			if (!mapEl)
				return;
			// create a map instance
			const mv = createView(false);
			const lyr = new GraphicsLayer({ visible: true, title: 'Skatch Layer' });

			mv.map = new Map({ basemap: "topo-vector", layers: [lyr] });
			setMapView(mv)
			// create a scene instance
			const sv = createView(true);
			sv.map = new Map({ basemap: "hybrid", ground: "world-elevation" });
			setSceneView(sv);

			setSkatchLayer(lyr);
		} catch (error) {
			console.log("Error in Skache, ", error);
		}

	}, [mapEl]);
	useEffect(() => {
		try {
			if (!mapView)
				return;
			if (activeView && activeView.viewpoint) {
				const activeViewpoint = activeView.viewpoint.clone();
				mapView.viewpoint = activeViewpoint;
				sceneView.viewpoint = activeViewpoint;
				activeView.container = null;
			}
			if (is3D) {
				setActiveView(sceneView);
			} else {
				setActiveView(mapView);
			}
		} catch (error) {
			console.log("error in useEffect 211 ", error);
		}

	}, [mapView, sceneView, is3D]);

	useEffect(() => {
		try {
			if (!activeView)
				return;
			if (activeView.container === null) {
				activeView.container = mapEl.current;
				addUIControls(activeView);
			}
			if (activeView.type === '3d') {
				setTimeout(() => {
					const cam = activeView.camera.clone();
					// the position is autocast as new Point()
					console.log(activeView.center);
					cam.position = [activeView.center.longitude, activeView.center.latitude, 682.98652];
					cam.heading = 53.86;
					cam.tilt = 45.45;
					// go to the new camera
					activeView.goTo(cam);
				}, 2000);
			}
		} catch (error) {
			console.log("error in useEffect 232 ", error);
		}


	}, [activeView]);

	const switchView = () => {
		setIs3D(!is3D);
	}
	const setContentInfo = (feature) => {
		
		const node = document.createElement('div');
		ReactDOM.render(
			<ParcelPopup data={feature.graphic} onCustomSuitability={(value)=>{setIsOpenAHP(true)}} view={activeView} />
			, node);
		return node;
	}
	const [isClosedIdentify, setIsClosedIdentify] = useState(false);
	const handleIdentifyDialogClose = (event) => {
		setIsClosedIdentify(true);
	}
	return <>
		<esriMapContext.Provider value={{ mapView, activeView, sceneView }} >
			<div ref={mapEl} className="esri-map" style={{ height: '92vh' }}>
				{children}
				<input onClick={() => { switchView() }} style={{ zIndex: 10 }}
					className="esri-custom-switchButton esri-component esri-widget--button esri-widget esri-interactive"
					type="button"
					value={!is3D ? "3D" : "2D"}
				/>

				<ToggleButtonGroup
					orientation="vertical"
					size="small"
					color="primary"
					value={activeControl}
					exclusive
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'left',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'left',
					}} style={{ zIndex: 10, position: 'absolute', bottom: 20, left: 30, transform: 'translateX(-50%)', backgroundColor: '#fff' }}
					onChange={(event, newValue) => { setActiveControl(newValue); }}
				>
					{/* <ToggleButton value="bookmarks" aria-label="bookmarks">
						<BookmarksIcon />
					</ToggleButton>
					<ToggleButton value="search" aria-label="search">
						<ContentPasteSearchIcon />
					</ToggleButton> */}
					<DraggableDialog selected={'landusezone' === activeControl}
						onOpen={() => { setActiveControl('landusezone') }} onClose={() => { handleIdentifyDialogClose() }}
						title="Land Use Analysis" icon={<LandscapeRoundedIcon />}>
						<IdentifyComponent view={activeView} closed={isClosedIdentify} />
					</DraggableDialog>
				</ToggleButtonGroup>

			</div>

			<SwipeableDrawer PaperProps={{
				sx: { width: "60%" },
			}}
				anchor={'right'}
				open={isOpenAHP}
				onClose={() => { setIsOpenAHP(false) }}
				onOpen={() => { setIsOpenAHP(true) }}
			>
				<SuitabilityAnalysis view={activeView} />
			</SwipeableDrawer>
			<div ref={popupEl}></div>

		</esriMapContext.Provider>
	</>;
}

export default EsriMap;