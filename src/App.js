import React, { useState } from 'react';
import './App.css';
import { AuthProvider, useAuth } from 'oidc-react';
import EsriMap from './pages/Map';
import FeatureLayer from './components/Layers/FeatureLayer';
import Header from './components/Header';
import BasemapDynamicLayer from './components/Layers/BasemapDynamicLayer';
import esriConfig from "@arcgis/core/config.js";

import { styled, useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraggableDialog from './components/Widgets/DraggableWidget';
import IdentifyComponent from './components/Widgets/Identifycomponent';
import LandscapeRoundedIcon from '@mui/icons-material/LandscapeRounded';

import logo from './assets/logo.png';
import Splash from './components/Splash';
import FontAwesomeicon from './components/FontAwesomeIcon';
import HagatnaView from './components/Layers/HagatnaView';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(0),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


esriConfig.assetsPath = "./assets";
function App() {

	const theme = useTheme();
	const auth = useAuth();
	const [open, setOpen] = React.useState(false);
	const [view,setView] = useState(null);
	const [isClosedIdentify, setIsClosedIdentify] = useState(false);
	const handleIdentifyDialogClose = (event) => {
		setIsClosedIdentify(true);
	}

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  
  if(!auth.userData)
  {
	return <Splash />;
  }

  return (
    <ThemeProvider theme={theme}>
	<Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Header />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
		BackdropProps={{ invisible: true }}
		ModalProps={{
			hideBackdrop: true,
		  }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>

		<img src={logo} alt="logo" height={56} />
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
			<ListItem key={"landuser"} disablePadding>
			<DraggableDialog title="Land Use Analysis" icon={<InboxIcon />} 
			onClose={() => { handleIdentifyDialogClose() }}
			icon={<FontAwesomeicon icon={'hill-avalanche'} />}>
						<IdentifyComponent view={view} closed={isClosedIdentify}  />
				</DraggableDialog>
			</ListItem>
        </List>
        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <EsriMap zoom={11} onViewChange={(view)=>{setView(view)}} show3D={true} center={[144.7937,13.4443]}>
		<BasemapDynamicLayer />
			<FeatureLayer  key={"fd"}  />
			<HagatnaView key="hagatna" />
		</EsriMap>
      </Main>
    </Box>
	</ThemeProvider>
  );
}

export default App;
