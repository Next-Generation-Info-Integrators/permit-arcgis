import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link } from '@mui/material';
import whitelogo from '../assets/images/white-logo.png'
import { useAuth } from 'oidc-react';;

const pages = [];
const settings = ['Profile', 'Account', 'Dashboard'];

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const auth = useAuth();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
      <Container maxWidth="xl">
        <Toolbar disableGutters>
			<img src={whitelogo} alt="logo" style={{
    marginRight: '30px'}} height={50} />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          > Insight Portal
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.title} target={page.target} href={page.url} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            Insight Portal
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link
			  href={page.url}
			  target={page.target}
                key={page.title}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.title}
              </Link>
            ))}
          </Box>
		  {auth.userData &&
		  <Box sx={{ flexGrow: 0 }}>
			  
		  <Tooltip title="Open settings">
			<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
			<Typography variant="caption"  fontSize={14} marginRight={1} color="#fff">
			  {auth.userData.profile.name}</Typography>
			  <Avatar alt={auth.userData.profile.name.toUpperCase()} src="/static/images/avatar/2.jpg" />
			 
			</IconButton>
		  </Tooltip>
		  <Menu
			sx={{ mt: '45px' }}
			id="menu-appbar"
			anchorEl={anchorElUser}
			anchorOrigin={{
			  vertical: 'top',
			  horizontal: 'right',
			}}
			keepMounted
			transformOrigin={{
			  vertical: 'top',
			  horizontal: 'right',
			}}
			open={Boolean(anchorElUser)}
			onClose={handleCloseUserMenu}
		  >
			{settings.map((setting) => (
			  <MenuItem key={setting} onClick={handleCloseUserMenu}>
				<Typography textAlign="center">{setting}</Typography>
			  </MenuItem>
			))}
			<MenuItem key="logout" onClick={()=>{
			  auth.signOutRedirect();
			}}>
				<Typography textAlign="center">Logout</Typography>
			  </MenuItem>
		  </Menu>
		</Box>
		  }
          
        </Toolbar>
      </Container>
  );
};
export default ResponsiveAppBar;
