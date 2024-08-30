const express = require("express");
const router = express.Router();
// const { pool } = require('../dbStartup');
const logger = require("../middleware/logger");
const {
  getDegreeinfoId,
  getPlansByRoot,
  getPlansByRootAndUser,
  getDegreeNames,
  createStudyPlan,
  savePositions,
  getCoursesByPlan,
  resetPositions,
} = require("../db");

router.get("/public", async (req, res) => {
  /* TODO, shows all degrees by logged_in uid, 'root', 'public'
  Fetches all official studyplans (name & plan_id & uid) from the database and returns them as a JSON array.
  */
  // const { uid } = req.body; // if null, uid = 'root' (?) - commented out for linting
});

/* LEGACY CODE
router.get('/search_by_degree', async (req, res) => {
  
  CHANGING CODE -> "Valitse tutkinto" - menu has used this, new route: '/search_plans_by_id'
  Fetches the degree structure from the database using the degree HY degree code and year.
  

  const degreeCode = req.headers['degree-id'].toLowerCase();
  const degreeYears = req.headers['degree-years'];
  logger.info(`Fetching degree with degree code: ${degreeCode} and year: ${degreeYears}`);

  try {
  const courses = await getDegrees(degreeCode, degreeYears);
    res.json(courses);
  } catch (error) {
    logger.error(`Error fetching degrees: ${error.message}`);
    res.status(500).send('Server error');
  }
});
*/

router.post("/search_plan_by_id", async (req, res) => {
  //searches a studyplan with a plan_id
  const { plan_id } = req.body;

  if (!plan_id) {
    logger.error("Plan ID is missing in headers");
    return res.status(400).send("Plan ID is required");
  }

  logger.info(`Fetching courses for plan ID: ${plan_id}`);

  try {
    const courses = await getCoursesByPlan(plan_id);
    res.json(courses);
  } catch (error) {
    logger.error(
      `Error fetching courses for plan ID ${plan_id}: ${error.message}`
    );
    res.status(500).send("Server error");
  }
});

router.get("/plans_by_root", async (req, res) => {
  try {
    const plans = await getPlansByRoot();
    res.json(plans);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/plans_by_root_and_user", async (req, res) => {
  const { uid } = req.body;
  try {
    const plans = await getPlansByRootAndUser(uid);
    res.json(plans);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.get("/plan_by_id", async (req, res) => {
  //TODO - OR ???
  //fetches the whole studyplan-object by studyplans.id
  // const { plan_id }  = req.body; - commented out for lint
  //tee kutsufunktio, joka käyttää plan_id:tä
  //tee mock-palautus ja rest-kysely
});

router.get("/degree_names", async (req, res) => {
  //fetches official degreenames and degreeinfo.id from degreeinfo, serves the degree selection menu when naming a new studyplan
  //needs no parameters, check returning object with rest/DegreeNames_GetAll.http
  const degreeNames = await getDegreeNames();
  logger.debug("Degreenames from database", degreeNames);
  res.json(degreeNames);
});

router.post("/create_studyplan", async (req, res) => {
  logger.info(
    "@/api/degrees/create_studyplan, received request body:",
    req.body
  );
  const { degree_id, name, uid } = req.body;
  try {
    const newPlan = await createStudyPlan(degree_id, name, uid);
    logger.info("@api/degrees/create_studyplan, adding studyplan:", newPlan);
    res.status(201).json(newPlan);
  } catch (error) {
    logger.info("Error creating study plan:", error);
    res.status(500).json({ error: "Suunnitelman luominen ei onnistunut" });
  }
});

router.post("/save_positions", async (req, res) => {
  //TODO, fix to fit new schema
  try {
    const degreeRows = await getDegreeinfoId(
      req.body.degreeId,
      req.body.degreeYears
    );
    if (degreeRows.length === 0) {
      return res.status(404).send("Degree not found");
    }

    const saved = await savePositions(
      degreeRows[0].id,
      req.body.coursePositions
    );
    if (saved) {
      res.status(200).send("Positions saved successfully");
    } else {
      res.status(404).send("Saving positions failed");
    }
  } catch (error) {
    console.error("Error saving positions:", error);
    return res.status(500).send("Internal server error");
  }
});

router.post("/reset_positions", async (req, res) => {
  try {
    const degreeRows = await getDegreeinfoId(
      req.body.degreeId,
      req.body.degreeYears
    );
    await resetPositions(degreeRows[0].id);
    return res.status(200).send("Positions resetted successfully");
  } catch (error) {
    console.error("Error resetting positions:", error);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
