const fs = require('fs');
const path = require('path');
//const { Pool } = require('pg');
require('dotenv').config();
const logger = require('../middleware/logger');
const { addDegreeinfo, getDegreeinfoId, addManyCourses } = require('../db');
const { addManyPrequisiteCourses, addDegreeData } = require('../db');

//const pool = new Pool({
//  connectionString: process.env.DATABASE_URL,
//});

function mapPrerequisites(jsonData) {
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

/* NEEDS CHANGES - saved as an example to look at, while workin on fix
const insertDataFromJson = async () => {
  //  Loads data from degreeToDb.json and inserts it into the database.
  try {
    const dataPath = path.join(__dirname, 'degreeToDb.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const courseCodes = jsonData.courses.map(course => (course.courseCode));
    const courseMappings = mapPrerequisites(jsonData);
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
*/

const insertPlansFromJson = async () => {
  //  Loads data from plansToDb.json and inserts it into the database, uid = 'root'
  // NOT fully working, problems with accessing the values of jsonData-object
  // inserts courses and prerequisiteCourses at the moment
  // lines that don't work yet, are commented out
  try {
    const dataPath = path.join(__dirname, 'plansToDb.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    logger.debug('@insertPlansFromJson, jsonData', jsonData);
    logger.debug('Keys in jsonData: ', Object.keys(jsonData));
    logger.debug('Values in jsonData.uid: ', Object.values(jsonData.uid));
    const key = Object.keys(jsonData)[0];
    logger.debug('@insertPlansFromJson, key = Object.keys(jsonData)[0]', key);
    //const { uid, degreeYears, degreeCode } = jsonData;
    const { degreeYears, degreeCode } = jsonData;
    //logger.info('@insertPlansFromJson, degreeYears', degreeYears);
    //logger.info('@insertPlansFromJson, degreeCode', degreeCode);
    //logger.info('@insertPlansFromJson, uid', uid);

    //const uid = JSON.parse(JSON.stringify(jsonData.uid));
    logger.debug('@insertPlansFromJson, jsonData', jsonData);

    const courseCodes = jsonData.courses.map(course => (course.courseCode));
    //logger.info('@insertPlansFromJson, courseCodes', courseCodes);
    const courseMappings = mapPrerequisites(jsonData);
    //logger.info('@insertPlansFromJson, courseMappings', courseMappings)

    //TODO tarvitaan metodi, joka etsii degreeinfo.id:n näillä tiedoilla,
    //jotta voidaan tallentaa tutkinto, vai onko se jo olemassa?
    //const degreeIdRows = await getDegreeinfoId(degreeCode, degreeYears);
    //const degreeId = degreeIdRows.id;
    //logger.info('@insertPlansFromJson, degreeId', degreeId)
    const courseDegreeMappings = mapCoursesForDegree(jsonData);
    await addManyCourses(courseCodes); 
    await addManyPrequisiteCourses(courseMappings);
    //await addDegreeData(degreeInfo, courseDegreeMappings);

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
  insertPlansFromJson, 
  insertDegreeinfoFromJson
};
