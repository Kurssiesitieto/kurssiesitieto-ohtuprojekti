import React, {useState, useEffect} from 'react';
import '../styles/AddStudyPlans.css';
import { error as displayError } from './messager/messager';
import { Menu, MenuItem, IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';


const AddStudyPlans = ({ isOpen, axiosInstance, onCreate, setNewCoursePlan, onClick }) => {
  const [newName, setNewName] = useState('')
  const [listOfDegrees, setDegreeToList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDegree, setSelectedDegree] = useState([]);

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
      console.error("Error when creating study plan:", error);
      displayError("Jokin meni pieleen. Yritä uudestaan myöhemmin.");
    }    
    onCreate();
    };

  if (!isOpen) {
    return null;
  }

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDegreeClick = (degree) => {
    setAnchorEl(null);    
    setSelectedDegree(degree)    
  };

  return (
    <div className="study-plans-view">
      <h3>Luo kurssikokonaisuus</h3>
      <IconButton 
          onClick={onClick} 
          aria-label="close" 
          className="close-button"
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            color: '#007bff', 
          }}
        >
          <CloseIcon />
      </IconButton>
      <div>
      <div className="dropdown">
            <button className="dropdown-button" onClick={handleMenuClick}>
              Valitse pääaine
            </button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {listOfDegrees.map((degree) => (
                <MenuItem key={degree.id} onClick={() => handleDegreeClick(degree)}>
                  {degree.degree_name}
                </MenuItem>
              ))}
            </Menu>
      </div>
      <form onSubmit={createStudyPlan}>
          <div>
            <label className="form-label">Anna kurssikokonaisuudelle nimi:</label> 
            <input
              className='form-input'
              value={newName}
              onChange={({ target }) => setNewName(target.value)}
              /*placeholder="Kirjoita nimi"*/
              required
            />
          </div>
          <p className="selected-degree">{selectedDegree.degree_name}</p>


          <button type="submit" className="submit-button">Luo uusi</button>
        </form>
      </div>
    </div>
  );
};

export default AddStudyPlans;