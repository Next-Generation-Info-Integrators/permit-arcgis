
import  React,{useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { ListItemButton, ListItemIcon, ListItemText, ToggleButton } from '@mui/material';



export default function DraggableDialog({children,handlerId, title,icon, value, selected, onOpen, onClose}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (reason) => {
	if (reason && reason === "backdropClick") 
	return;
    setOpen(false);
	if(onClose)
		onClose();
  };
  useEffect(()=>{
	if(!onOpen)
		return;
	onOpen();
  },[open])
  function PaperComponent(props) {
	return (
	  <Draggable
		handle={handlerId}
		cancel={'[class*="MuiDialogContent-root"]'}
	  >
		<Paper {...props} />
	  </Draggable>
	);
  }
  return (
    <>

		<ListItemButton onClick={handleClickOpen}>
                <ListItemIcon>
                  {icon}
                </ListItemIcon>
                <ListItemText primary={title} />
        </ListItemButton>
      <Dialog  
	  disableEnforceFocus
	  style={{ pointerEvents: 'none'}}
	  PaperProps={{ style: { pointerEvents: 'auto',position:'fixed',top: 35,right: 0 } }}
	  BackdropProps={{hidden:true}}
        open={open} hideBackdrop={true} disableBackdropClick
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby={handlerId}
      >
        <DialogTitle style={{ cursor: 'move' }} id={handlerId}>
          {title}
        </DialogTitle>
        <DialogContent>{children}
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
