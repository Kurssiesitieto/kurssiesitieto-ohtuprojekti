import React from 'react';
import { useState, useEffect } from 'react';
import "../styles/SearchBar.css"
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import Box from '@mui/material/Box';

export const SearchBar = (props) => {
  const [searchText, setSearchText] = useState('');
  const [dbCourses, setDbCourses] = useState([]);  
  const [currentPlanId, setCurrentPlanId] = useState(props.currentPlanId);
  const axios = props.axiosInstance;


  const fetchDatabaseSearchSuggestions = async () => {
    try {
        const response = await axios.post('/api/courses/databaseGetCoursesByPlan', { plan_id: currentPlanId });
        setDbCourses(response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching courses for plan ${currentPlanId}`, error);
    }
  };

  console.log("dbCourses", dbCourses)

  

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
      setSearchText(newValue.hy_course_id + " (" + newValue.course_name +")");
      handleSubmit(event, newValue.hy_course_id)  
    }
  }

  useEffect(() => {
    setCurrentPlanId(props.currentPlanId);
  }, [props.currentPlanId]);

  useEffect(() => {
    fetchDatabaseSearchSuggestions(axios)
  }, [currentPlanId])

  return ( 
    <div className='searchbar'>   
    <form onSubmit={handleSubmit}>
    <Autocomplete
      className='autocomplete'
      id="searchBar"
      options={dbCourses}
      inputValue={searchText}
      onInputChange={handleChange}
      onChange={handleSelect}

      getOptionLabel={(option) => option.hy_course_id + " (" + option.course_name + ")"}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <Box component="li" key={option.hy_course_id} {...otherProps} className="searchResult">
            {option.hy_course_id} ({option.course_name})
          </Box>
        );
      }}
    
      renderInput={(params) => <TextField {...params}
        id="textField"
        data-testid="testTextField"
        label="Hae kurssi:"
        variant="standard"
        className="textFieldInput"
        
      />}
    />
    </form>
    </div>
  )
}

export default SearchBar