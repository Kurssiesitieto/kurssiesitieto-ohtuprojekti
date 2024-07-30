const fs = require('fs');
const path = require('path');
//const { Pool } = require('pg');
require('dotenv').config();
const { addManyCourses, addManyPrequisiteCourses, addDegreeData, addDegreeinfo } = require('../db');

//const pool = new Pool({
//  connectionString: process.env.DATABASE_URL,
//});

function mapPrerequisistes(jsonData) {
  let courseMappings = [];

  jsonData.courses.forEach(course => {
      course.prerequisiteCourses.forEach(prerequisiteCourse => {
          courseMappings.push({
              course: course.courseCode,
              prerequisiteCourse: prerequisiteCourse, 
              courseType: course.courseType || 'compulsory' // Include relation type if available, otherwise 'compulsory'
          });
      });
  });
  return courseMappings;
}

function mapCoursesForDegree(jsonData) {
  let courseMappings = [];

  jsonData.courses.forEach(course => {
    courseMappings.push({
      course: course.courseCode, 
      courseType: course.courseType || 'compulsory' // Include relation type if available, otherwise 'compulsory'
    });
  });
  return courseMappings;
}

function mapDegreesForDegreeinfo(jsonData) {
  let degreeMappings = [];
  jsonData.degrees.forEach(degree => {
    degreeMappings.push({
      degreeName: degree.degreeName,
      degreeCode: degree.degreeCode,
      degreeYears: degree.degreeYears
    });
  });
  return degreeMappings;
}


const insertDataFromJson = async () => {
  //  Loads data from degreeToDb.json and inserts it into the database.
  try {
    const dataPath = path.join(__dirname, 'degreeToDb.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const courseCodes = jsonData.courses.map(course => (course.courseCode));
    const courseMappings = mapPrerequisistes(jsonData);
    const degreeInfo = {
      degreeName: jsonData.degreeName,
      degreeYears: jsonData.degreeYears,
      degreeCode: jsonData.degreeCode, 
    };
    const courseDegreeMappings = mapCoursesForDegree(jsonData);
    await addManyCourses(courseCodes); 
    await addManyPrequisiteCourses(courseMappings);
    await addDegreeData(degreeInfo, courseDegreeMappings);

  } catch (err) {
    console.error('Error inserting degreedata:', err);
  }
};

const insertDegreeinfoFromJson = async () => {
  // Loads data from degreeInfoToDb.json and inserts it into the database.
  try {
    const dataPath = path.join(__dirname, 'degreeinfoToDb.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const degreeMappings = mapDegreesForDegreeinfo(jsonData);
    await addDegreeinfo(degreeMappings);
  } catch (err) {
    console.error('Error inserting degreeinfo:', err);
  };
};

module.exports = {
  insertDataFromJson, insertDegreeinfoFromJson
};
