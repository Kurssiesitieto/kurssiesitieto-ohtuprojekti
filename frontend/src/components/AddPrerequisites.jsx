import React, { useState, useEffect } from 'react';
import '../styles/AddPrerequisites.css';
//import { error as displayError } from './messager/messager';


const AddPrerequisites = ({ isOpen, axiosInstance, newCoursePlan}) => {
  const [courseCode, setCourseCode] = useState('');
  const [prerequisiteCodes, setPrerequisiteCodes] = useState('');


  const addPrerequisites = async (event) => {   // 
    event.preventDefault();
    /*
    const prerequisitesObject = {
      courseCode: courseCode,
      prerequisiteCodes: prerequisiteCodes.split(',').map(code => code.trim()), // 
      studyPlanId: newCoursePlan.id // 
    };

    try {
      const response = await axiosInstance.post('/api/degrees/addCourseToStudyplan', prerequisitesObject);
      if (response.status === 200) { // Assumption that successful creation returns 200
        setCourseCode('');
        setPrerequisiteCodes('');
      } else {
        displayError("Kurssin lisääminen opintosuunnitelmaan epäonnistui.");
        console.error("Failed to add course to study plan.");        
      }
    } catch (error) {
      console.error("Error adding course to study plan:", error);
      displayError("Jokin meni pieleen. Yritä uudestaan myöhemmin.");
    } */
    
    setCourseCode('');
    setPrerequisiteCodes('');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="prerequisites-view">
      <h2>Tutkinnon luominen: TÄHÄN selectedDegree.degree_name </h2>      
      <form onSubmit={addPrerequisites}>
        <div>
          <label>Anna lisättävän kurssin kurssikoodi</label>
          <input
            value={courseCode}
            onChange={({ target }) => setCourseCode(target.value)}
            placeholder="TKT200005"
          />
        </div>
        <div>
          <label>Anna kurssille esitietokurssit kurssikoodeilla</label>
          <input
            value={prerequisiteCodes}
            onChange={({ target }) => setPrerequisiteCodes(target.value)}
            placeholder="TKT200007, TKT200009..."
          />
        </div>
        <button type="submit">Lisää</button>
      </form>
    </div>
  );
};

export default AddPrerequisites;