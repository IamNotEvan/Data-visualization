import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


const MenuBar = (props) => {

  const [anchorEl, setAnchorEl] = useState(null);
  const [localStorageKeys, setLocalStorageKeys] = useState([]);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [saveAsPopoverAnchorEl, setSaveAsPopoverAnchorEl] = useState(null);
  const [saveAsFileName, setSaveAsFileName] = useState('');
  const [currentFileName, setCurrentFileName] = useState("pr1");
  const saveAsButtonRef = React.useRef(null);
  const [openDialog, setOpenDialog] = useState(false);

  const open = Boolean(anchorEl);
  const popoverOpen = Boolean(popoverAnchorEl);
  const saveAsPopoverOpen = Boolean(saveAsPopoverAnchorEl);


  const handleDialogClose = (confirm) => {
    if (confirm) {
      localStorage.setItem(saveAsFileName + '.json', JSON.stringify(props.data));
      setCurrentFileName(saveAsFileName);
      setSaveAsPopoverAnchorEl(null);
      setSaveAsFileName('');
    }
    setOpenDialog(false);
  };

  const handleNewClick = (callback) => {
    setCurrentFileName("Untitled");
    if (typeof callback === 'function') {
      callback();
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setPopoverAnchorEl(null);
  };

  const loadLocalStorageKeys = (event) => {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      keys.push(key);
    }
    setLocalStorageKeys(keys);
    setPopoverAnchorEl(event.currentTarget);
  };

  const handleLoadItemClick = (key) => {
    const value = localStorage.getItem(key);
    props.loadData(value);
    setCurrentFileName(key.replace('.json', ''));
    handleClose();
  };

  const handleSaveAsClick = (event) => {
    setSaveAsPopoverAnchorEl(event.currentTarget);
  };

  const handleSaveAsInputChange = (event) => {
    setSaveAsFileName(event.target.value);
  };

  const handleSaveButtonClick = () => {
    if (saveAsFileName) {
      if (localStorage.getItem(saveAsFileName + '.json') !== null) {
        setOpenDialog(true);
      } else {
        localStorage.setItem(saveAsFileName + '.json', JSON.stringify(props.data));
        setCurrentFileName(saveAsFileName);
        setSaveAsPopoverAnchorEl(null);
        setSaveAsFileName('');
      }
    }
  };

  const handleSaveAsPopoverClose = () => {
    setSaveAsPopoverAnchorEl(null);
    setSaveAsFileName('');  // Reset the text input box

  };

  const handleSaveClick = () => {

    if (currentFileName === 'Untitled') {
      const syntheticEvent = { currentTarget: saveAsButtonRef.current };
      handleSaveAsClick(syntheticEvent);
    } 
    else 
    {
      localStorage.setItem(currentFileName + '.json', JSON.stringify(props.data));
      setCurrentFileName(currentFileName);  
      setSaveAsPopoverAnchorEl(null); 
      setSaveAsFileName(''); 
      handleClose(); 
    }
  }

  return (
    <Box  sx={{display:"flex", alignItems:"center", justifyContent:"center", maxWidth: '100%', maxHeight: '100%' }}>
      <Toolbar>
        <Button
          size='small'
          style={{ color: 'dodgerblue', backgroundColor: 'white'}}
          aria-controls="file-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          File
        </Button>
        <Menu
          id="file-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'file-button',
          }}
        >
          <MenuItem onClick={() => handleNewClick(props.setEmptyData)}>New</MenuItem>
          <MenuItem onClick={loadLocalStorageKeys}>Load</MenuItem>
          <MenuItem onClick={handleSaveClick}>Save</MenuItem>
          <MenuItem onClick={handleSaveAsClick} ref={saveAsButtonRef}>Save As</MenuItem>
        </Menu>
        <Popover
          open={popoverOpen}
          anchorEl={popoverAnchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          {localStorageKeys.map((key) => (
            <MenuItem key={key} onClick={() => handleLoadItemClick(key)}>
              {key}
            </MenuItem>
          ))}
        </Popover>
        <Popover
          open={saveAsPopoverOpen}
          anchorEl={saveAsPopoverAnchorEl}
          onClose={handleSaveAsPopoverClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
            <TextField
              size="small"
              value={saveAsFileName}
              onChange={handleSaveAsInputChange}
              placeholder="Enter file name"
            />
            <Button onClick={handleSaveButtonClick} style={{ marginLeft: '8px' }}>
              Save
            </Button>
          </div>
        </Popover>
      </Toolbar>
        <Box ml={-2} mt={0}> {/* Add margin top here */}
          <TextField
            size="small"
            value={"File Name: " + currentFileName}
            InputProps={{
              readOnly: true,
              style: { color: 'white'}, // Add this line to change text color
            }}
            variant="outlined"
            sx={{
              maxWidth: '100%', // Ensure it doesn't grow beyond its container
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent', // Change border color to white
              },
            }}
          />
        </Box>
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
        >
          <DialogTitle>{"File already exists"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`${saveAsFileName}.json already exists. Do you want to replace it?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleDialogClose(true)} autoFocus>
              Yes
            </Button>
            <Button onClick={() => handleDialogClose(false)}>No</Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
};

export default MenuBar;
