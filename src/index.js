import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from 'oidc-react';

const oidcConfig = {
	onSignIn: (user) => {
	  // Redirect?
	  console.log(user);
	  window.location.hash = '';
	},
	onSignOut: () => {
		//window.location.reload();
	},
	authority: 'https://auth.eblpguam.com',
	clientId: 'insightgis',
	redirectUri: 'https://insight.eblpguam.com',//https://insight.eblpguam.com
	responseType: 'token id_token',
  	scope: 'openid profile email api1 roles',
  };
ReactDOM.render(
  <React.StrictMode>

<AuthProvider {...oidcConfig}>
	  <App />
	</AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
