const express = require('express');
const router = express.Router();
const { getCourses, addCourse, deleteCourse, updateCourse,
  addPrerequisiteCourse, removePrerequisiteCourse,
  addCourseAndPrerequisitesToStudyplan,
  fetchCourseWithPrerequisites,
  getAllCoursesWithPrerequisites,
  getCourseWithReqursivePrerequisites } = require('../db');
const logger = require('../middleware/logger');


const findCourseWithDependencies = (identifier, allCourses) => {
  const course = allCourses.find(course => course.identifier === identifier);
  if (!course) return [];

  let courses = [course];
  course.dependencies.forEach(dep => {
      courses = [...courses, ...findCourseWithDependencies(dep, allCourses)];
  });

  return courses;
};

// Database routes for getting courses, not to be integrated with the system until database is set

function asyncHandler(fn) {
  return async function(req, res, next) {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  };
}
router.post('/addCourseToStudyplan', asyncHandler(async (req, res) => {
  //TODO 
  //adds a course with its prerequisitecourses to studyplan
  //needs = plan_id
  //add course to courses
  //add course_plan -relation
  logger.debug('@api/courses/addCourseToStudyplan');
  const { plan_id, courseCode, prerequisiteCodes = [] } = req.body; 
  try {
    await addCourseAndPrerequisitesToStudyplan(plan_id, courseCode, prerequisiteCodes);
    res.status(200).json({ message: 'Courses added to study plan successfully' });
  } catch (error) {
    logger.error('Error adding courses to study plan:', error);
    res.status(500).json({ error: 'Failed to add courses to study plan' });
  }
  //update graph
  //return ??
}));

router.post('/addCourse', asyncHandler(async (req, res) => {
  //a helper route for develepoers to figure out if addCourse works with new schema
  logger.info('@api/courses/addCourse, incoming req.body', req.body);
  const { courseCode } = req.body;
  const addedCourse = await addCourse(courseCode);
  res.json(addedCourse);
}));

router.get('/databaseGetCourses', asyncHandler(async (req, res) => {
  const courses = await getCourses();
  logger.debug("Courses from database", courses);
  res.json(courses);
}));

router.get('/databaseGetCourseWithRequirements/:plan_id/:course_id', asyncHandler(async (req, res) => {
  const { plan_id, course_id } = req.params;
  const courseRequirements = await getCourseWithReqursivePrerequisites(plan_id, course_id);
  logger.debug("Course requirements", courseRequirements);
  res.json(courseRequirements);
}));

router.post('/databaseCreateCourse', asyncHandler(async (req, res) => {
  //new attribute: uid
  logger.debug("Received request body:", req.body);
  //const { uid } = req.body;
  const { official_course_id, course_name, kori_name } = req.body;
  const newCourse = await addCourse(official_course_id, course_name, kori_name);
  logger.debug("Adding course", newCourse);
  res.json(newCourse);
}));

router.delete('/databaseDeleteCourse/:kori_name', asyncHandler(async (req, res) => {
  const { kori_name } = req.params;
  const rowsDeleted = await deleteCourse(kori_name);
  
  if (rowsDeleted > 0) {
    res.send({ message: 'Course deleted successfully' });
  } else {
    res.status(404).send({ message: 'Course not found or could not be deleted' });
  }
}));

router.put('/databaseUpdateCourse/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { official_course_id, course_name, kori_name } = req.body;
  const updatedCourse = await updateCourse(id, official_course_id, course_name, kori_name);
  res.json(updatedCourse);
}));

// Add dependencies

router.post('/addPrerequisiteCourse', asyncHandler(async (req, res) => {
  const { course_kori_name, prerequisite_course_kori_name } = req.body;
  const newPrerequisite = await addPrerequisiteCourse(course_kori_name, prerequisite_course_kori_name);
  logger.debug("Added new prerequisite course relation", newPrerequisite);
  res.json(newPrerequisite);
}));

router.delete('/removePrerequisiteCourse', asyncHandler(async (req, res) => {
  const { course_hy_id, prerequisite_course_hy_id } = req.body;
  await removePrerequisiteCourse(course_hy_id, prerequisite_course_hy_id);
  res.send({ message: 'Prerequisite course relation removed successfully' });
}));

// Fetch based on dependencies

router.get('/getCourseWithPrerequisites/:course_kori_name', asyncHandler(async (req, res) => {
  const { course_kori_name } = req.params;
  const courseGraph = await fetchCourseWithPrerequisites(course_kori_name);

  if (courseGraph) {
    logger.debug("Course and its prerequisites:", courseGraph);
    res.json(courseGraph);
  } else {
    res.status(404).send({ message: 'Course not found or it has no prerequisites.' });
  }
}));



// --------------- FOR TESTING ONLY ----------------

router.get('/getAllCoursesWithPrerequisites', asyncHandler(async (req, res) => {
  const allCoursesWithPrerequisites = await getAllCoursesWithPrerequisites();
  res.json(allCoursesWithPrerequisites);
}));

  
  module.exports = router;
  module.exports.findCourseWithDependencies = findCourseWithDependencies;