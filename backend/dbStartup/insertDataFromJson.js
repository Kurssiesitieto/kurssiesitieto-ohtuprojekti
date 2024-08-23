const fs = require('fs');
const path = require('path');
//const { Pool } = require('pg');
require('dotenv').config();
const logger = require('../middleware/logger');
const { addDegreeinfo, getDegreeinfoId, addManyCourses, createStudyPlan, addCourseAndPrerequisitesToStudyplan } = require('../db');
const { addManyPrerequisiteCourses } = require('../db');

//const pool = new Pool({
//  connectionString: process.env.DATABASE_URL,
//});

const processPrerequisites = async (plan_id, jsonData) => {
  const { courses } = jsonData;
  for (const course of courses) {
    const { courseCode, prerequisiteCourses } = course;
    await addManyPrerequisiteCourses(plan_id, courseCode, prerequisiteCourses);
  }
  //should this return something or give an error (for testing)?
};

const processCoursePlanRelations = async (plan_id, jsonData) => {
  const { courses } = jsonData;
  for (const course of courses) {
    const { courseCode, prerequisiteCourses } = course;
    await addCourseAndPrerequisitesToStudyplan(plan_id, courseCode, prerequisiteCourses);
  }
  //shoud this return something or give an error (for testing)?
};

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

const insertPlansFromJson = async () => {
  //  Loads data from TKT23-26.json and inserts it into the database, uid = 'root'
  try {
    const dataPath = path.join(__dirname, 'TKT23-26.json');
    logger.debug('dataPath', dataPath);
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const { uid, degreeYears, degreeCode, name } = jsonData;
    const degreeIdRows = await getDegreeinfoId(degreeCode, degreeYears);
    const degree_id = degreeIdRows[0].id;
    const planRows = await createStudyPlan(degree_id, name, uid);
    const courseCodes = jsonData.courses.map(course => (course.courseCode));
    await addManyCourses(courseCodes);
    const plan_id = planRows.plan_id;
    await processPrerequisites(plan_id, jsonData);
    await processCoursePlanRelations(plan_id, jsonData);
    } catch (err) {
    console.error('Error inserting json-data for math:', err);
  }
  //  Loads data from plansToDb.json and inserts it into the database, uid = 'root'
  try {
    const dataPath = path.join(__dirname, 'plansToDb.json');
    logger.debug('dataPath', dataPath);
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const { uid, degreeYears, degreeCode, name } = jsonData;
    const degreeIdRows = await getDegreeinfoId(degreeCode, degreeYears);
    const degree_id = degreeIdRows[0].id;
    const planRows = await createStudyPlan(degree_id, name, uid);
    const courseCodes = jsonData.courses.map(course => (course.courseCode));
    await addManyCourses(courseCodes);
    const plan_id = planRows.plan_id;
    await processPrerequisites(plan_id, jsonData);
    await processCoursePlanRelations(plan_id, jsonData);
    } catch (err) {
    console.error('Error inserting json-data for CS:', err);
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
  }
};

module.exports = {
  insertPlansFromJson, 
  insertDegreeinfoFromJson
};
