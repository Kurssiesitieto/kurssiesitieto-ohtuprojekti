import React, {useState, useEffect} from 'react';
import '../styles/AddStudyPlans.css';
import { error as displayError } from './messager/messager';
import { Menu, MenuItem, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const AddStudyPlans = ({ isOpen, axiosInstance, onCreate, setNewCoursePlan, onClick }) => {
  const [newName, setNewName] = useState('')
  const [listOfDegrees, setDegreeToList] = useState([]);
  const [selectedDegree, setSelectedDegree] = useState("");


  const fetchDegrees = async () => {  
    try {
      const response = await axiosInstance.get(`/api/degrees/degree_names`);
      if (response == null) {
        displayError("Palvelimelle ei saatu yhteyttä")
        return;
      }
      setDegreeToList(response.data);
    } catch (error) {
      console.error("Error when fetching degree data: ", error);
      displayError("Jokin meni pieleen. Yritä uudestaan myöhemmin.")
    }
  };

  useEffect(() => {
    fetchDegrees();
  }, []);

  const createStudyPlan = async (event) => {    
    event.preventDefault();

    const studyPlanObject = {
      degree_id: selectedDegree.id,
      name: newName,      
      uid: 'rest'  // Needs to give an uid when the functionality is available
    };

    try {
      const response = await axiosInstance.post(`/api/degrees/create_studyplan`, studyPlanObject);
      if (response.status === 201) { // Assumption that successful creation returns 201
        const { plan_id } = response.data;      
        setNewCoursePlan({ plan_id, plan_name:newName, degree_name: selectedDegree.degree_name, });        
        onCreate();
        setNewName('');
        setSelectedDegree([]);
      } else {
        displayError("Opintosuunnitelman luominen epäonnistui.");
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        displayError("Kurssikokonaisuuden nimi on jo käytössä. Valitse uusi.");
      } else {
        console.error("Error when creating study plan:", error);
        displayError("Jokin meni pieleen. Yritä uudestaan myöhemmin.");
    }} 
    //onCreate();
    };

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    setSelectedDegree(event.target.value);
  };

  const handleDegreeClick = (degree) => {
    setSelectedDegree(degree)
  };


  return (
    <div className="study-plans-view">
      <div className="close-button">
      <IconButton
          onClick={onClick} 
          aria-label="close" 
        >
          <CloseIcon />
      </IconButton>
      </div>
      <h3>Luo kurssikokonaisuus</h3>
      <div>
      <div>
       <Box sx={{ minWidth: 300 }}>
        <FormControl fullWidth>
          <InputLabel id="choose-major">Valitse pääaine</InputLabel>
          <Select
            labelId="choose-major"
            value={selectedDegree}
            label="selectedDegree"
            onChange={handleChange}
          >
               {listOfDegrees.map((degree) => (
                  <MenuItem value={degree} key={degree.hy_degree_id} onClick={() => handleDegreeClick(degree)}>
                    {degree.degree_name}
                  </MenuItem>
              ))}
          </Select>
        </FormControl>
       </Box>

      </div>
      <form onSubmit={createStudyPlan}>
          <div>
            <label className="form-label">Anna kurssikokonaisuudelle nimi:</label> 
            <input
              className='form-input'
              value={newName}
              onChange={({ target }) => setNewName(target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Luo uusi</button>
        </form>
      </div>
    </div>
  );
};

export default AddStudyPlans;