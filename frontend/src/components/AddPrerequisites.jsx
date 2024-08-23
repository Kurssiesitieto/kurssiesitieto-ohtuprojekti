import React, { useState } from 'react';
import '../styles/AddPrerequisites.css';
import { IconButton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { error as displayError } from './messager/messager';


const AddPrerequisites = ({ isOpen, axiosInstance, newCoursePlan, onClick, DegreeChange}) => {
  const [courseCode, setCourseCode] = useState('');
  const [prerequisiteCodes, setPrerequisiteCodes] = useState('');

  const planName = newCoursePlan?.plan_name || '';


  const addPrerequisites = async (event) => { 
    event.preventDefault();
    
    const prerequisitesObject = {
      plan_id: newCoursePlan.plan_id,
      courseCode: courseCode,
      prerequisiteCodes: prerequisiteCodes ? prerequisiteCodes.split(',').map(code => code.trim()) : [] 
    };

    try {
      const response = await axiosInstance.post('/api/courses/addCourseToStudyplan', prerequisitesObject);
      if (response.status === 200) { 
        setCourseCode('');
        setPrerequisiteCodes('');
      } else {
        displayError("Kurssin lisääminen opintosuunnitelmaan epäonnistui.");
        console.error("Failed to add course to study plan.");        
      }
    } catch (error) {
      console.error("Error adding course to study plan:", error);
      displayError("Jokin meni pieleen. Yritä uudestaan myöhemmin.");
    } 
    
    setCourseCode('');
    setPrerequisiteCodes('');
    DegreeChange(newCoursePlan)
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="prerequisites-view">
      <div className="close-button">
      <IconButton 
          onClick={onClick} 
          aria-label="close"
        >
          <CloseIcon />
      </IconButton> 
      </div>
      <h3 className='header2'>{planName}</h3>     
      <form onSubmit={addPrerequisites}>
        <div>
          <label className='form-label-give-course'>Anna lisättävän kurssin kurssikoodi:</label>
          <input
            className='form-input'
            value={courseCode}
            onChange={({ target }) => setCourseCode(target.value)}
            placeholder="TKT200005"
          />
          <label className='form-label-course-prerequisites'>Anna kurssille esitietokurssit kurssikoodeilla:</label>
          <input
            className='form-input'
            value={prerequisiteCodes}
            onChange={({ target }) => setPrerequisiteCodes(target.value)}
            placeholder="TKT200007, TKT200009..."
          />
        </div>
        <button className='submit-courses-button' type="submit">Lisää</button>
      </form>
    </div>
  );
};

export default AddPrerequisites;