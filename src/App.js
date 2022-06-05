import './App.css';

import EsriMap from './pages/Map';
import FeatureLayer from './components/Layers/FeatureLayer';
import Header from './components/Header';
import BasemapDynamicLayer from './components/Layers/BasemapDynamicLayer';
import esriConfig from "@arcgis/core/config.js";


esriConfig.assetsPath = "./assets";
function App() {
  return (
    <>
	<Header />
	<EsriMap zoom={11} show3D={false} center={[144.7937,13.4443]}>
		
	<BasemapDynamicLayer />
		<FeatureLayer  key={"fd"}  />
	</EsriMap>
	</>
  );
}

export default App;
