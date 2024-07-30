const express = require('express');
const router = express.Router();
// const { pool } = require('../dbStartup');
const logger = require('../middleware/logger');
const { getDegrees,
  getStarted, 
  getDegreeId,
  getDegreeNames, 
  savePositions,
  resetPositions} = require('../db');


router.get('/', async (req, res) => {
  /*
  Fetches all degrees from the database and returns them as a JSON array.
  */

  try {
    //const result = await pool.query('SELECT * FROM degrees ORDER BY degree_name');
    const result = await getStarted()
    const degrees = result.rows.map(degree => ({ 
      degree_name: degree.degree_name, 
      degree_years: degree.degree_years,
      hy_degree_id: degree.hy_degree_id
    }));
    logger.verbose("Degrees fetched:", degrees);
    res.json(degrees);
  } catch (error) {
    logger.error(`Error fetching degrees: ${error.message}`);
    res.status(500).send('Server error');
  }
});

router.get('/search_by_degree', async (req, res) => {
  /*
  Fetches the degree structure from the database using the degree HY degree code and year.
  */

  const degreeCode = req.headers['degree-id'].toLowerCase();
  const degreeYears = req.headers['degree-years'];
  logger.info(`Fetching degree with degree code: ${degreeCode} and year: ${degreeYears}`);

  try {
  const courses = await getDegrees(degreeCode, degreeYears)
    res.json(courses);
  } catch (error) {
    logger.error(`Error fetching degrees: ${error.message}`);
    res.status(500).send('Server error');
  }
});

router.get('/degree_names', async (req, res) => {
  const degreeNames = await getDegreeNames();
  logger.debug("Degreenames from database", degreeNames);
  res.json(degreeNames);
});

router.post('/save_positions', async (req, res) => {
  try {
    const degreeRows = await getDegreeId(req.body.degreeId, req.body.degreeYears);
    if (degreeRows.length === 0) {
        return res.status(404).send('Degree not found');
    }

    const saved = await savePositions(degreeRows[0].id, req.body.coursePositions);
    if (saved) {
      res.status(200).send('Positions saved successfully');
    } else {
      res.status(404).send('Saving positions failed');
    }
  } catch (error) {
      console.error('Error saving positions:', error);
      return res.status(500).send('Internal server error');
  }
});

router.post('/reset_positions', async (req, res) => {
  try {
    const degreeRows = await getDegreeId(req.body.degreeId, req.body.degreeYears);
    await resetPositions(degreeRows[0].id)
    return res.status(200).send('Positions resetted successfully');
  } catch (error) {
      console.error('Error resetting positions:', error);
      return res.status(500).send('Internal server error');
  }
});

module.exports = router;  
