import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import '../styles/DegreeSelectionMenu.css';


function DegreeSelectionMenu({ onDegreeChange, listOfDegrees }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleSelect = (degree) => {
    onDegreeChange(degree);
    handleClose();
  };
  
  return (
    <div>
     <Button
        id="degreeSelectionButton"
        aria-controls="degree-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}        
      >
        {'Valitse tutkinto'}
      </Button>
      <Menu
        id="degree-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {listOfDegrees.map((degreeOption) => (
          <MenuItem
            key={degreeOption.plan_id}
            onClick={() => handleSelect(degreeOption)}
            id={`degree-option-${degreeOption.degree_name.replace(/\s+/g, '-').toLowerCase()}`}
          >
            {degreeOption.plan_name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default DegreeSelectionMenu;
