import { useState, useEffect } from 'react';
import CourseGraph from '../components/CourseGraph';
import Sidebar from '../components/sidebar';
import Course from '../models/Course';
import Messenger from '../components/messager/MessagerComponent';
import { error as displayError } from '../components/messager/messager';
import { Navbar } from '../components/Navbar.jsx';
import StartPage from './StartPage';

const MainPage = ({ axiosInstance }) => {
  const [listOfDegrees, setDegreeToList] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCourseName, setSelectedCourseName] = useState('');
  const [selectedCourseGroupID, setSelectedCourseGroupID] = useState('');
  const [courses, setCourses] = useState([]);
  const [selectedDegreeName, setSelectedDegreeName] = useState('');
  const [newCoursePlan, setNewCoursePlan] = useState(null);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [isStartPageOpen, setIsStartPageOpen] = useState(true);
  const [logged, setLogged] = useState(false);

  

  const fetchDegreeCourses = async (degree) => {  
    console.log("degree", degree)  
    try {
      if (degree == null) {
        displayError("Jokin meni pieleen tutkintotietoja haettaessa!");
        console.error("Degree is null!");
        return;
      }
      const response = await axiosInstance.post(`/api/degrees/search_plan_by_id`, { 
        plan_id: degree.plan_id,
      });

      if (response == null) {
        displayError("Jokin meni pieleen kurssitietoja haettaessa!");
        console.error("Response is null!");
        return;
      }
      const convertedCourses = response.data.map(courseData => new Course(
        courseData.name,
        courseData.identifier,
        courseData.kori_id,
        courseData.dependencies,
        courseData.type,
        courseData.description,
        courseData.x,
        courseData.y
      ));      
      setCourses(convertedCourses);
      setSelectedDegreeName(degree.plan_name);
      if (!convertedCourses ) {
        throw new Error("Kurssitietoja ei löytynyt!");
      }      
    } catch (error) {
      console.error("Error fetching data: ", error);
      displayError(error.message || "Jokin meni pieleen!");
    }
  };

  const handleSearch = async (courseId) => {
    if (courseId === "") {
      return;
    }
    let response;
    response = await axiosInstance.get(`/api/courses/databaseGetCourseWithRequirements/${currentPlanId}/${courseId}`);
    if (response == null || response.status === 404) {
      displayError("Kurssitietoja ei löytynyt!");
      return;
    }
    const convertedCourses = response.data.map(courseData => new Course(
      courseData.course_name,
      courseData.identifier,
      courseData.kori_id,
      courseData.dependencies,
      'compulsory'
    ));
    setCourses(convertedCourses);
  };

  const fetchDegrees = async () => {
    try {
      const response = await axiosInstance.get(`/api/degrees/plans_by_root`); //Needs to update when uid available
      if (response == null) {
        displayError("Palvelimelle ei saatu yhteyttä");
        return;
      }
      setDegreeToList(response.data);      
    } catch (error) {
      console.error("Error when fetching degree data: ", error);
      displayError("Jokin meni pieleen. Yritä uudestaan myöhemmin.");
    }
  };

  useEffect(() => {    
    fetchDegrees();
  }, []);

  useEffect(() => {
    console.log("listOfDegrees", listOfDegrees)
    if (listOfDegrees.length < 0) {        
        const degreeToFetch = listOfDegrees.find(degree => degree.degree_name === 'Tietojenkäsittelytieteen kandidaattitutkinto 2023-2026');
        if (degreeToFetch) {
          fetchDegreeCourses(degreeToFetch);
        } else {
          fetchDegreeCourses(listOfDegrees[0]);
        }
      }  
  }, [listOfDegrees]);

  useEffect(() => {    
    if (newCoursePlan) {
      fetchDegreeCourses(newCoursePlan);
    }
  }, [newCoursePlan]);

  const handleDegreeChange = (degree) => {
    setCurrentPlanId(degree.plan_id)
    fetchDegreeCourses(degree);
  };

  if (!logged && isStartPageOpen) {
    return (
      <StartPage
        axiosInstance={axiosInstance}
        listOfDegrees={listOfDegrees}
        onDegreeChange={handleDegreeChange}
        setCurrentPlanId={setCurrentPlanId}
        setIsStartPageOpen={setIsStartPageOpen}
      />
    );
  }

  return (
    <div>
      <Messenger />
      <CourseGraph
        axiosInstance={axiosInstance}
        courses={courses}
        setSelectedCourseName={setSelectedCourseName}
        setSelectedCourseGroupID={setSelectedCourseGroupID}
        setIsSidebarOpen={setIsSidebarOpen}
        handleSearch={handleSearch}
      />

      <div className='navBar-container'>
        <Navbar
          handleDegreeChange={handleDegreeChange}
          listOfDegrees={listOfDegrees}
          axiosInstance={axiosInstance}
          handleSearch={handleSearch}
          selectedDegreeName={selectedDegreeName}
          baseURL={axiosInstance.defaults.baseURL}
          newCoursePlan={newCoursePlan}
          setNewCoursePlan={setNewCoursePlan}
        />
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        closeSidebar={() => setIsSidebarOpen(false)}
        selectedCourseName={selectedCourseName}
        selectedCourseGroupID={selectedCourseGroupID}
        axiosInstance={axiosInstance}
      />
    </div>
  );
};

export default MainPage;