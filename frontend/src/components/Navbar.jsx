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
import LogoutButton from './LogoutButton';

export const Navbar = ({
  handleDegreeChange,
  listOfDegrees,
  axiosInstance,
  handleSearch,
  baseURL,
  selectedDegreeName,
  newCoursePlan,
  setNewCoursePlan,
  loggedInUser,
}) => {
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

  const changeOpenAddPrerequisites = () => {
    setIsAddPrerequisitesOpen(!isAddPrerequisitesOpen)
  };

  const login = () => {
    window.location.href = import.meta.env.BASE_URL;
  }
  
  const logout = () => {
    const baseURL = import.meta.env.BASE_URL.replace('/esitieto', '');
    window.location.href = baseURL + "/Shibboleth.sso/Logout";
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
        <li>{loggedInUser ? <LogoutButton onClick={logout}/> : <LoginButton onClick={login}/>}</li>
        <li><InfoButton onClick={openInfoBox}/></li>
        <li><InfoBox isOpen={isInfoBoxOpen} onClose={() => setIsInfoBoxOpen(false)} baseURL={baseURL} /></li>
        <li>{loggedInUser && <AddStudyPlansButton onClick={openAddStudyPlans} />}</li>
        <li><AddStudyPlans isOpen={isAddStudyPlansOpen} axiosInstance={axiosInstance} onCreate={openAddPrerequisites} setNewCoursePlan={setNewCoursePlan} onClick={openAddStudyPlans}/></li>
        <li><AddPrerequisites isOpen={isAddPrerequisitesOpen} axiosInstance={axiosInstance} onClick={changeOpenAddPrerequisites} newCoursePlan={newCoursePlan} DegreeChange={handleDegreeChange}/></li>
      </ul>
    </nav>
  );
};

export default Navbar;
