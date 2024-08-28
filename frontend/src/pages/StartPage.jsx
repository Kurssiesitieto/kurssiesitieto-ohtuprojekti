import React from 'react';
import '../styles/StartPage.css';

const StartPage = () => {

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
        <p></p>
        <p>Tämä sovellus on luotu Ohjelmistotuotanto-kurssin projektityönä Helsingin yliopistolle.</p>
        <p>Lähdekoodi löytyy <a href="https://github.com/Kurssiesitieto/kurssiesitieto-ohtuprojekti">täältä</a></p>
                
        <div className="buttons">                  
          <button onClick={handleLoginClick}>Kirjaudu sisään</button>          
        </div>
      </div>
    </div>
  );
};

export default StartPage;