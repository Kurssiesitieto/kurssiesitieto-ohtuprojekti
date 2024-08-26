import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './styles/App.css'

import StartPage from './pages/StartPage';
import MainPage from './pages/MainPage';
import MissingPage from './pages/MissingPage';
import LoginPage from './pages/LoginPage';

import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(false);
  const [user, setUserData] = useState(null);
  const [publicUser, setPublicUser] = useState(null);
  const [loggedInPublicPage, setLoggedInPublicPage] = useState(false);

  const axiosInstance = axios.create({
    baseURL: import.meta.env.BASE_URL //import.meta.env.BASE_URL is from vite.config.js. It refers to the base variable it the defineConfig
  });

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/api/kirjauduttu');
      
      const kirjauduttu = response.data.kirjauduttu;
      const user = response.data.user;      

      console.log('req.data.kirjauduttu:', kirjauduttu);
      console.log('req.data.user', user);
      
      setLoggedInUser(kirjauduttu);
      setUserData(user);

      //drop mockUser locally for /public page
      const isProduction = process.env.NODE_ENV === 'production';
      setPublicUser(isProduction ? user : null);
      setLoggedInPublicPage(isProduction ? kirjauduttu : false);

    } catch (error) {
      console.error('Error fetching data:', error);
      setLoggedInUser(false);
      setUserData(null);
      setPublicUser(null);
      setLoggedInPublicPage(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log('loggedInUser:', loggedInUser);
    console.log('user:', user);
    console.log('loggedInPublicPage:', loggedInPublicPage);
    console.log('publicUser:', publicUser);
  }, [loggedInUser, user, loggedInPublicPage, publicUser]);

  const login_url = import.meta.env.BASE_URL.replace('esitieto', 'esitietologin');

  return (
    <Router>
      <Routes>
        <Route
          path={import.meta.env.BASE_URL + "/"}
          element={<MainPage
            axiosInstance={axiosInstance}
            loggedInUser={loggedInUser}
            user={user}
          />}
        />
        <Route
          path={import.meta.env.BASE_URL + "/start"}
          element={<StartPage
            axiosInstance={axiosInstance}
            loggedInUser={loggedInUser}
            user={user}
          />}
        />
        <Route path={login_url} element={<LoginPage axiosInstance={axiosInstance}/>} />
        <Route
          path={import.meta.env.BASE_URL + "/public"}
          element={<MainPage
            axiosInstance={axiosInstance}
            loggedInUser={loggedInPublicPage}
            user={publicUser}
          />}
        />
        <Route path={import.meta.env.BASE_URL + "*"} element={<MissingPage axiosInstance={axiosInstance} />} />
      </Routes>
    </Router>

  );
}

export default App;
