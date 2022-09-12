import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import logo from '../assets/logo.png';

const Splash = () => {
	return <Grid
  container
  spacing={0}
  direction="column"
  alignItems="center"
  justifyContent="center"
  style={{ minHeight: '100vh',backgroundColor: '#000'}}
>

  <Grid item xs={3}>
	<div className="loader">
  		<img src={logo}  alt="logo" />
  </div>
  </Grid>   
   
</Grid> 
}

export default Splash;