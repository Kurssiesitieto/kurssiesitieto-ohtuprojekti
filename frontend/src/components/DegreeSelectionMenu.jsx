/* import React, { useState } from 'react';
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
            key={degreeOption.degree_name}
            onClick={() => handleSelect(degreeOption)}
            id={`degree-option-${degreeOption.degree_name.replace(/\s+/g, '-').toLowerCase()}`}
          >
            {degreeOption.degree_name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
*/
import React from 'react';
import { useState, useEffect } from 'react';
import '../styles/DegreeSelectionMenu.css';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';

function DegreeSelectionMenu({ onDegreeChange, listOfDegrees }) {
  const [searchText, setSearchText] = useState('');

  const handleSubmit = (event, searchQuery) => {
    event.preventDefault();
    const code = searchQuery || (searchText ? searchText.split(" ")[0] : '');
    props.handleSearch(code)
  }
  
  const handleChange = (event, newValue) => {
    setSearchText(newValue);
  };

  const handleSelect = (event, newValue) => {
    if (newValue === null) {
      return;
    }
    if (event.type === 'click' ) {
      setSearchText(newValue.degree_name);
      handleSubmit(event, newValue.degree_name)  
    }
  }

  return ( 
    <div className='degreeSelectionButton'>   
    <form onSubmit={handleSubmit}>
    <Autocomplete
      className='autocomplete'
      id="degreeSelectionButton"
      options={listOfDegrees}
      inputValue={searchText}
      onInputChange={handleChange}
      onChange={handleSelect}

      getOptionLabel={(option) => option.degree_name}
      renderOption={(props, option) => (
        <Box component="li" sx={{ p: 2 }} {...props} className="searchResult">
              {option.degree_name}
        </Box>
      )}
    sx={{ width: 300,
      '& .MuiAutocomplete-popupIndicator': {
        color: 'white',
      },
      '& .MuiAutocomplete-clearIndicator': {
        color: 'white',
      },
      '& .MuiInput-underline:before': {
        borderBottomColor: 'white' 
      },
      '& .MuiInput-underline:after': {
        borderBottomColor: 'white' 
      },
    }}
      renderInput={(params) => <TextField {...params}
        id="textField"
        data-testid="testTextField"
        label="Valitse tutkinto:"
        variant="standard"
        InputLabelProps={{style: {color: '#fff', fontSize: 20}}}
        sx={{
          '& .MuiInputBase-input': {
            color: 'white',
          }
        }}
      />}
    />
    </form>
    </div>
  )
}
export default DegreeSelectionMenu;
