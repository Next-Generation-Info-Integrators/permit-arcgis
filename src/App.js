import logo from './logo.svg';
import './App.css';

import EsriMap from './pages/Map';
import { setDefaultOptions } from 'esri-loader';
import FeatureLayer from './components/Layers/FeatureLayer';
import Header from './components/Header';
import BasemapDynamicLayer from './components/Layers/BasemapDynamicLayer';

setDefaultOptions({ css: true });

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
