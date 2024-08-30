import React, { useState, useEffect } from "react";
import { handleFetchKORICourseInfo } from "../functions/CourseFunctions";
import { CourseActivityDesc } from "./CourseActivityDesc";
import "../styles/sidebar.css";
import { Button } from "@mui/material";
import { error as displayError } from "../components/messager/messager";

const Sidebar = ({
  isOpen,
  closeSidebar,
  selectedCourseName,
  selectedCourseGroupID,
  axiosInstance,
}) => {
  //const [activityDesc, setActivityDesc] = useState(false);
  const [courseActivityDesc, setCourseActivityDesc] = useState("");
  const [selectedCourseDescription, setSelectedCourseDescription] =
    useState("");
  const [selectedCourseCredits, setSelectedCourseCredits] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    const getCourseInfo = async () => {
      if (!selectedCourseGroupID) return;
      try {
        const responseByInfo = await handleFetchKORICourseInfo(
          axiosInstance,
          selectedCourseGroupID
        );
        if (responseByInfo && responseByInfo.length > 0) {
          const courseInfo = responseByInfo[0];
          setCourseActivityDesc(courseInfo.additional.fi);

          const link = courseInfo.id ?? null;
          if (link) {
            setLink(
              `https://sisu.helsinki.fi/student/courseunit/${link}/brochure`
            );
          }
          const credits = courseInfo.credits
            ? courseInfo.credits.max
            : "unable to fetch credits";
          const code = courseInfo.code
            ? courseInfo.code
            : "unable to fetch code";
          setSelectedCourseCredits(`Opintopisteet: ${credits}`);
          setSelectedCourseDescription(`Kurssikoodi: ${code}`);
        }
      } catch (error) {
        console.error("Failed to fetch course info:", error);
        setSelectedCourseDescription("Failed to fetch from KORI");
        displayError(
          `Kurssitietoja ei saatu haettua kurssista ${selectedCourseName}`
        );
      }
    };

    if (isOpen) {
      getCourseInfo();
    }
  }, [isOpen, selectedCourseName, axiosInstance]);

  if (!isOpen) return null;

  return (
    <div className="sidebar">
      <button onClick={closeSidebar} className="close-button">
        X
      </button>
      <h2>{selectedCourseName}</h2>
      <CourseActivityDesc desc={courseActivityDesc} />
      <p>
        {selectedCourseDescription}
        <br />
        {selectedCourseCredits}
      </p>

      {link && (
        <Button
          className="sisu-button"
          variant="contained"
          onClick={() => {
            window.open(link, "_blank");
          }}
        >
          Kurssi sisussa
        </Button>
      )}
    </div>
  );
};

export default Sidebar;
