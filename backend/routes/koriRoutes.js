const express = require("express");
const router = express.Router();
const KoriInterface = require("../interfaces/koriInterface");
const kori = new KoriInterface();
const logger = require("../middleware/logger");

router.get("/search_by_name", async (req, res) => {
  try {
    const search = req.query.search;
    const response = await kori.searchCourses(search);
    res.setHeader("Access-Control-Allow-Origin", "*");

    const exactMatch = response.searchResults.find(
      (course) => course.name === search
    );

    if (exactMatch) {
      res.json([exactMatch]);
    } else {
      res.json(response.searchResults);
    }

    logger.debug(`KORI Results from search term ${search}`);
  } catch (err) {
    console.error("Error accessing Kori API:", err);
    res.status(500).send("Server error");
  }
});

router.get("/get_info_by_id", async (req, res) => {
  try {
    const search = req.query.search;
    const response = await kori.courseInfo(search);
    logger.debug(`Courses from Kori ${response}`);
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.json(response);
  } catch (err) {
    console.error("Error accessing Kori API:", err);
    res.status(500).send("Server error");
  }
});

// Temporary function for testing out that the KORI API, to be removed later!

router.get("/getKori", async (req, res) => {
  try {
    const search = req.query.search;
    const courses = await kori.searchCourses(search);
    logger.debug(`Courses from Kori ${courses}`);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(courses);
  } catch (err) {
    console.error("Error accessing Kori API:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
