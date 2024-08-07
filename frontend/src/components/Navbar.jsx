import React, { useState } from 'react';
import "../styles/navbar.css";
import SearchBar from './SearchBar';
import InfoBox from './InfoBox';
import AddStudyPlans from './AddStudyPlans';
import AddPrerequisites from './AddPrerequisites'
import DegreeSelectionMenu from './DegreeSelectionMenu';
import InfoButton from './InfoButton';
import AddStudyPlansButton from './AddStudyPlansButton';
import LoginButton from './LoginButton';

export const Navbar = ({ handleDegreeChange, listOfDegrees, axiosInstance, handleSearch, baseURL, selectedDegreeName, newCoursePlan, setNewCoursePlan}) => {
  const [isInfoBoxOpen, setIsInfoBoxOpen] = useState(false);
  const [isAddStudyPlansOpen, setIsAddStudyPlansOpen] = useState(false);
  const [isAddPrerequisitesOpen, setIsAddPrerequisitesOpen] = useState(false);

  const openInfoBox = () => {
    setIsInfoBoxOpen(!isInfoBoxOpen);
  };

  const openAddStudyPlans = () => {
    setIsAddStudyPlansOpen(!isAddStudyPlansOpen)
  };

  const openAddPrerequisites = () => {
    setIsAddStudyPlansOpen(!isAddStudyPlansOpen)
    setIsAddPrerequisitesOpen(!isAddPrerequisitesOpen)
  };

  const login = () => {
    window.location.href = import.meta.env.BASE_URL;
  }

  return (
    <nav className="nav">
      <ul className="navbar li">
        <li>
          <DegreeSelectionMenu
            onDegreeChange={handleDegreeChange}
            listOfDegrees={listOfDegrees}
          />
        </li>
        <li><SearchBar axiosInstance={axiosInstance} handleSearch={handleSearch} /></li>
        <li className='degree-name'>{selectedDegreeName}</li>
        <li><LoginButton onClick={login}/></li>
        <li><InfoButton onClick={openInfoBox}/></li>
        <li><InfoBox isOpen={isInfoBoxOpen} onClose={() => setIsInfoBoxOpen(false)} baseURL={baseURL} /></li>
        <li><AddStudyPlansButton onClick={openAddStudyPlans} /></li>
        <li><AddStudyPlans isOpen={isAddStudyPlansOpen} axiosInstance={axiosInstance} onCreate={openAddPrerequisites} setNewCoursePlan={setNewCoursePlan} /></li>
        <li><AddPrerequisites isOpen={isAddPrerequisitesOpen} axiosInstance={axiosInstance} onClick={openAddPrerequisites} newCoursePlan={newCoursePlan} /></li>
      </ul>
    </nav>
  );
};

export default Navbar;
