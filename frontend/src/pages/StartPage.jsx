import React, { useState, useEffect } from 'react';
import '../styles/StartPage.css';
import { error as displayError } from '../components/messager/messager';
import { Menu, MenuItem} from '@mui/material'; 

const StartPage = ({ axiosInstance }) => {
  const [listOfDegrees, setDegreeToList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const fetchDegrees = async () => {
    try {
      const response = await axiosInstance.get(`/api/degrees/plans_by_root`);
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

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDegreeClick = (degree) => {
    setAnchorEl(null);
    localStorage.setItem('selectedDegree', JSON.stringify(degree));
    const baseURL = import.meta.env.BASE_URL.replace('/esitieto', '');
      window.location.href = baseURL + "public";
  };
        
    const handleLoginClick = () => {
      window.location.href = import.meta.env.BASE_URL;        
    }    
  
  return (
    <div className="start-page">
        okei
      <div className="header">
        <h2>Kurssin esitietojen visualisointityökalu</h2>
      </div>
      <div className="content">
        <p>Tämä sovellus näyttää tarvittavat kurssiesitiedot tietyille tutkinto-ohjelmille Helsingin yliopistossa.</p>
        <p>Käyttäjäopas löytyy <a href="https://github.com/Kurssiesitieto/kurssiesitieto-ohtuprojekti/blob/main/documentation/user-guide.md">täältä</a></p>
        <p>Käyttäjäoppaasta <a href="https://github.com/Kurssiesitieto/kurssiesitieto-ohtuprojekti/blob/main/documentation/user-guide.md">löytyy</a> ohjeet uuden tutkinnon lisäämiseen</p>      
        <p></p>
        <p>Tämä sovellus on luotu Ohjelmistotuotanto-kurssin projektityönä Helsingin yliopistolle.</p>
        <p>Lähdekoodi löytyy <a href="https://github.com/Kurssiesitieto/kurssiesitieto-ohtuprojekti">täältä</a></p>
                
        <div className="buttons">
          <button onClick={handleMenuClick}>
            Näytä tutkinnot
          </button>        
          <button onClick={handleLoginClick}>Kirjaudu sisään</button>          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {listOfDegrees.map((degree) => (
              <MenuItem key={degree.hy_degree_id} onClick={() => handleDegreeClick(degree)}>
                {degree.degree_name}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
