require('dotenv').config();
const logger = require('../middleware/logger');
logger.info(`DATABASE_HOST: ${process.env.DATABASE_HOST}`);
logger.info(`DATABASE_PORT: ${process.env.DATABASE_PORT}`);
logger.info(`DATABASE_NAME: ${process.env.DATABASE_NAME}`);
const KoriInterface = require('../interfaces/koriInterface');


const { Pool } = require('pg');
const kori = new KoriInterface();


const selectPool = () => {
  //SEEMS OK
  if (process.env.DATABASE_POOLMODE === "direct") {
    logger.info("Using direct DATABASE_POOLMODE")
    return new Pool({
      connectionString: process.env.DATABASE_DIRECT
    });
  } else {
    logger.info("Using default DATABASE_POOLMODE")
    return new Pool({
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      port: process.env.DATABASE_PORT,
    });
  }
};

const pool = selectPool();

// Course CRUD

const addCourse = async (addedCourse) => {
  /* Function call comes through addManyCourses, is used by dbStartUp/insertDataFromJson
  addManyCourses takes a list of coursecodes = ['MAT11001, MAT11002']
  Uses somehow KoriInterface to get the course name and group_id
  A separate route api/courses/addCourse is created for developer use
  */ 
  const response = await kori.searchCourses(addedCourse);
  const exactMatch = response.searchResults.find(course => course.name === addedCourse || course.code === addedCourse);
  if (!exactMatch) {
    logger.error(`No exact match found for course ${addedCourse}`);
    return;
  }
  const { name, groupId, code } = exactMatch;

  try {
    const { rows } = await pool.query(
      `INSERT INTO courses (kori_id, course_name, hy_course_id)
      SELECT $1, $2, $3
      ON CONFLICT (kori_id) DO NOTHING
      RETURNING *`,
      [groupId, name, code]
    );
    if (rows.length === 0) {
      logger.verbose(`Course ${addedCourse} already exists in the database.`);
      return;
    }
    return rows[0];
  } catch (err) {
    console.error(`Error adding course ${addedCourse} to the database: \n`);
  }
};

const addManyCourses = async (listOfCourses) => {
  /*
  Accepts a list of courses objects and adds them to the database.

  Works with exact matches of HY course id and course name. 
  
  Note: Course names might not be unique, but the course ids are.
  */
  await Promise.all(listOfCourses.map(async course => {
    await addCourse(course);
  }))
};



const getCourses = async () => {
  //Do we need to update this? or delete? we have getCoursesByPlan
  const { rows } = await pool.query('SELECT * FROM courses');
  return rows;
};

const getCourseWithReqursivePrerequisites = async (plan_id, hy_course_id) => {
  const query = `
  WITH RECURSIVE PrerequisitePath AS (
    SELECT
        c.id,
        c.kori_id,
        c.course_name, 
        c.hy_course_id,
        pc.prerequisite_course_id AS prerequisite_id,
        COALESCE(
          (
            SELECT array_agg(pc2.hy_course_id)
            FROM prerequisite_courses pr
            JOIN courses pc2 ON pr.prerequisite_course_id = pc2.id
            WHERE pr.course_id = c.id AND pr.plan_id = $1
          ),
          '{}'::text[]
        ) AS dependencies
    FROM
        courses c
    LEFT JOIN
        prerequisite_courses pc ON c.id = pc.course_id AND pc.plan_id = $1
    WHERE
        c.hy_course_id = $2
    UNION 
    SELECT
        c.id,
        c.kori_id,
        c.course_name, 
        c.hy_course_id,
        pc.prerequisite_course_id,
        COALESCE(
          (
            SELECT array_agg(pc2.hy_course_id)
            FROM prerequisite_courses pr
            JOIN courses pc2 ON pr.prerequisite_course_id = pc2.id
            WHERE pr.course_id = c.id AND pr.plan_id = $1
          ),
          '{}'::text[]
        ) AS dependencies
    FROM
        courses c
    LEFT JOIN
        prerequisite_courses pc ON c.id = pc.course_id AND pc.plan_id = $1
    JOIN
        PrerequisitePath pp ON pp.prerequisite_id = c.id
  )
  SELECT DISTINCT
      p.id, 
      p.kori_id, 
      p.course_name, 
      p.hy_course_id AS identifier,
      p.dependencies
  FROM
      PrerequisitePath p;
  `;
  const { rows } = await pool.query(query, [plan_id, hy_course_id]);
  return rows;
};

/*
const updateCourse = async (id, official_course_id, course_name, kori_name) => {
  const { rows } = await pool.query(
    'UPDATE course_info SET official_course_id = $2, course_name = $3, kori_name = $4 WHERE id = $1 RETURNING *',
    [id, official_course_id, course_name, kori_name]
  );
  return rows[0];
};
*/

// Dependency

const addPrerequisiteCourse = async (plan_id, course_hy_id, prerequisite_course_hy_id) => {
  //console.log('@addPrerequisiteCourse, plan_id', plan_id);
  const query = `
  INSERT INTO prerequisite_courses (plan_id, course_id, prerequisite_course_id)
  SELECT $1, c1.id, c2.id
  FROM (SELECT id FROM courses WHERE hy_course_id = $2) AS c1, 
       (SELECT id FROM courses WHERE hy_course_id = $3) AS c2
  ON CONFLICT ON CONSTRAINT unique_course_prerequisite DO NOTHING
  RETURNING *`;
  const { rows } = await pool.query(
    query,
    [plan_id, course_hy_id, prerequisite_course_hy_id]
  );
  return rows[0];
};

const addManyPrerequisiteCourses = async (planId, courseCode, prerequisiteCodes) => {
  //OLD SCHEMA, needs alteration
  /* Accepts plan_id, courseCode, and a list of prerequisiteCodes.

  The expected format for prerequisiteCodes is for example:
  [
    'TKT10003',
    'TKT10004',
  ]
  Relation type will be 'compulsory' by default. Using other types requires changes.
  */
  const plan_id = planId;
  const course_hy_id = courseCode;
  for (const prerequisite_course_hy_id of prerequisiteCodes) {
    try {
      const result = await addPrerequisiteCourse(plan_id, course_hy_id, prerequisite_course_hy_id);
      if (result) {
        logger.info(`Prerequisite for course ${course_hy_id} with prerequisite ${prerequisite_course_hy_id}
          of type successfully added to the database.`);
      } else {
        logger.verbose(`No new prerequisite relation added for course ${course_hy_id} with
          prerequisite ${prerequisite_course_hy_id}. It might already exist.`);
      }
    } catch (err) {
      logger.error(`Error adding prerequisite for course ${course_hy_id} with prerequisite ${prerequisite_course_hy_id}
        to the database:`, err);
    }
  }
};


// Complex, need to move them to a separate file later!

// Fetches a course and all it's required courses recursively.
async function fetchCourseWithPrerequisites(courseKoriName) {
  //OLD SCHEMA, needs updating - include plan_id into consideration
  const allCourses = await fetchAllCoursesWithDirectPrerequisites();

  // Create a mapping of kori_name to official_course_id for direct lookup
  const koriNameToOfficialIdMap = new Map(allCourses.map(course => [course.course, course.official_course_id]));

  function buildCourseGraph(koriName, coursesMap, visited = new Set()) {
    if (visited.has(koriName)) {
      // TODO: add dependency for already drawn course
      return null; // Prevent infinite recursion
    }
    visited.add(koriName);

    const course = coursesMap.get(koriName);
    if (!course) return null;

    const courseWithDependencies = {
      //needs updating as different studyplans may have different prerequisites
      //according to what the user has selected
      name: course.course_name,
      identifier: course.official_course_id,
      koriName: koriName, // Adding koriName to the course object
      dependencies: course.direct_prerequisites
        .map(prerequisiteKoriName => buildCourseGraph(prerequisiteKoriName, coursesMap, visited))
        .filter(Boolean) // Ensure only valid courses are included
    };
    return courseWithDependencies;
  }

  const coursesMap = new Map(allCourses.map(course => [course.course, course]));

  const courseGraph = buildCourseGraph(courseKoriName, coursesMap);

  // Function to transform the graph into the desired array structure
  function transformGraphToArray(courseGraph, array = []) {
    if (courseGraph) {
      // Transform the current course into the desired object structure
      const courseObject = {
        name: courseGraph.name,
        kori_name: courseGraph.koriName,
        official_course_id: courseGraph.identifier,
        // Replace kori_names in dependencies with official_course_id using the map
        dependencies: courseGraph.dependencies.map(dep => koriNameToOfficialIdMap.get(dep.koriName)).filter(Boolean)
      };
      array.push(courseObject);

      // Recursively process each dependency to flatten the structure
      courseGraph.dependencies.forEach(dependency => {
        transformGraphToArray(dependency, array);
      });
    }
    return array;
  }

  // Use the transform function to convert the graph into the array of courses
  return transformGraphToArray(courseGraph);
}

async function fetchAllCoursesWithDirectPrerequisites() {
  const { rows } = await pool.query(`
    SELECT
      ci.kori_name AS "course",
      ci.course_name,
      ci.official_course_id,
      COALESCE(ARRAY_AGG(pcr.prerequisite_course_kori_name) FILTER (WHERE pcr.prerequisite_course_kori_name IS NOT NULL), ARRAY[]::VARCHAR[]) AS "direct_prerequisites"
    FROM
      course_info ci
    LEFT JOIN
      prerequisite_course_relation pcr ON ci.kori_name = pcr.course_kori_name
    GROUP BY ci.kori_name, ci.course_name, ci.official_course_id;
  `);
  return rows;
}


const addCourseToStudyplan = async (planId, hyCourseId, relationType = 'compulsory') => {
  //TODO
  //adds course_plan relation
  try {
    //OLD code for old schema, to be replaced with addCourseToStudyplan
    const { rows } = await pool.query(
      `INSERT INTO course_plan_relation (plan_id, course_id, relation_type)
      VALUES (
        $1,
        (SELECT id FROM courses WHERE hy_course_id = $2),
        $3
      )
      ON CONFLICT ON CONSTRAINT unique_course_plan_relation DO NOTHING
      RETURNING *;`,
      [planId, hyCourseId, relationType]
    );

    if (rows.length === 0) {
      logger.verbose(`Course ${hyCourseId} already exists in the studyplan ${planId}.`);
      return;
    }
    return rows[0];
  } catch (error) {
    logger.verbose('Error inserting data into course_degree_relation table:', error);
  }
}

const addCourseAndPrerequisitesToStudyplan = async (plan_id, courseCode, prerequisiteCodes = []) => {
  /* A higher function that calls helper functions
  Adds courses and presequisitecourses to courses-table
  Adds course-prerequisitecourse -relations to prerequisites-table (with plan_id)
  */
  const allCourses = [courseCode, ...prerequisiteCodes]
  await addManyCourses(allCourses);
  await addManyPrerequisiteCourses(plan_id, courseCode, prerequisiteCodes);
  for (const course of allCourses) {
    await addCourseToStudyplan(plan_id, course);
  }
}


const getPlansByRoot = async () => {
  const query = `
      SELECT sp.id AS plan_id, sp.name AS plan_name, di.degree_name 
      FROM studyplans sp
      JOIN degreeinfo di ON sp.degree_id = di.id
      JOIN user_plan_relation upr ON sp.id = upr.plan_id
      WHERE upr.uid = 'root';
  `;

  const { rows } = await pool.query(query);
  
  const plans = rows.map(row => ({
      plan_id: row.plan_id,
      plan_name: row.plan_name,
      degree_name: row.degree_name
  }));

  return plans;
};

const getPlansByRootAndUser = async (uid) => {
  const query = `
      SELECT sp.id AS plan_id, sp.name AS plan_name, di.degree_name 
      FROM studyplans sp
      JOIN degreeinfo di ON sp.degree_id = di.id
      JOIN user_plan_relation upr ON sp.id = upr.plan_id
      WHERE upr.uid = $1 OR upr.uid = 'root';
  `;

  const { rows } = await pool.query(query, [uid]);

  const plans = rows.map(row => ({
      plan_id: row.plan_id,
      plan_name: row.plan_name,
      degree_name: row.degree_name
  }));

  return plans;
};

const createStudyPlan = async (degree_id, name, uid = 'root') => {
  const planRows = await addStudyPlan(degree_id, name);
  const plan_id = planRows.id;
  //TODO: add/use function for getting hy_degree_id and degree_years from degree_info (?)
  //is that necessary? When starting, json-file has degree_id included
  //is this info available, when the user has selected the study program from dropdown menu?
  const userPlanRelationRows = await addUserPlanRelation(plan_id, uid);
  logger.info('@addStudyPlan, userPlanRelationRows[0]', userPlanRelationRows[0])
  const addedPlan = {
    plan_id: plan_id,
    name: name,
    degree_id: degree_id,
    uid: uid
  };
  logger.info('@createStudyPlan, addedPlan', addedPlan)
  return addedPlan;
};

const addStudyPlan = async (degree_id, name) => {
  //TODO: check if name exists already! return errormsg
  const planNameIsNotUnique = async (name) => {
    const { rows } = await pool.query(
      `SELECT EXISTS (
          SELECT 1
          FROM studyplans
          WHERE name = $1
      ) AS nameExists`,
      [name]
    );
    const { nameExists } = rows[0];
    return nameExists;
  };

  const nameInUse = await planNameIsNotUnique(name)
  if (nameInUse) {
    logger.verbose(`Plan with name ${name} already exists in the database.`);
    return;
  }

  const { rows } = await pool.query(
    `INSERT INTO studyplans (degree_id, name)
    VALUES ($1, $2)
    RETURNING *;`,
    [degree_id, name]
  );
  logger.info('@addStudyPlan, added rows', rows);
  return rows[0];
};

const addUserPlanRelation = async (plan_id, uid = 'root') => {
  logger.info("@addUserPlanRelation, input plan_id, uid", plan_id, uid)
  const { rows } = await pool.query(
    `INSERT INTO user_plan_relation (uid, plan_id)
    VALUES ($1, $2)
    RETURNING *;`,
    [uid, plan_id]
  );
  return rows;
};

const addSingleDegreeinfo = async (degreeCode, degreeName, degreeYears) => {
  // Workaround for now. 'ON CONSTRAINT' works with one constraint only without some tomfoolery.
  const degreeNameIsNotUnique = async (degreeName) => {
    const { rows } = await pool.query(
      `SELECT EXISTS (
          SELECT 1
          FROM degreeinfo
          WHERE degree_name = $1
      ) AS degreeinfoExists`,
      [degreeName]
    );
    const { degreeinfoExists } = rows[0];
    return degreeinfoExists;
  };

  const nameInUse = await degreeNameIsNotUnique(degreeName);
  if (nameInUse) {
    logger.verbose(`Degree ${degreeName} already exists in the database.`);
    return;
  }

  const { rows } = await pool.query(
    `INSERT INTO degreeinfo (degree_name, hy_degree_id, degree_years)
    SELECT $1, $2, $3
    ON CONFLICT ON CONSTRAINT unique_year_for_hy_degree_id DO NOTHING
    RETURNING *`,
    [degreeName, degreeCode, degreeYears]
  );
  if (rows.length === 0) {
    logger.verbose(`Degree '${degreeName}' already exists in the database.`);
    return;
  }
  return;
};

const addDegreeinfo = async (degreeMappings) => {
  await Promise.all(degreeMappings.map(async degree => {
    await addSingleDegreeinfo(degree.degreeCode, degree.degreeName, degree.degreeYears);
  }));
};

const getAllCoursesWithPrerequisites = async () => {
  const { rows } = await pool.query(`
    SELECT 
      c.kori_name as course, 
      p.prerequisite_course_kori_name as prerequisite
    FROM 
      course_info c
    LEFT JOIN 
      prerequisite_course_relation p ON c.kori_name = p.course_kori_name
  `);
  return rows;
};

const getCoursesByPlan = async (plan_id = 1) => {
  const query = `
    SELECT 
      c.course_name AS name, 
      c.kori_id, 
      c.hy_course_id AS identifier, 
      cpr.relation_type AS type,
      cp.x AS x,
      cp.y AS y,
      COALESCE(
        (
          SELECT array_agg(pc2.hy_course_id)
          FROM prerequisite_courses pr
          JOIN courses pc2 ON pr.prerequisite_course_id = pc2.id
          WHERE pr.course_id = c.id AND pr.plan_id = $1
        ),
        '{}'::text[]
      ) AS dependencies
    FROM course_plan_relation cpr
    JOIN courses c ON cpr.course_id = c.id
    LEFT JOIN course_positions cp ON cp.plan_id = cpr.plan_id AND cp.course_id = cpr.course_id
    WHERE cpr.plan_id = $1
  `;

  const { rows: courses } = await pool.query(query, [plan_id]);
  return courses;
};

const getDegreeNames = async () => {
  try {
    const query = `
      SELECT degree_name, id
      FROM degreeinfo
      ORDER BY degree_name DESC
    `;

    const { rows: degreeRows } = await pool.query(query);
    return degreeRows;
  } catch (error) {
    logger.debug('Failed to retrieve degreenames from database', error);
    return false;
  }
};


const getDegreeinfoId = async (degreeCode, degreeYears) => {
  //TODO, connect to route (?)
  try {  
    const degreeQuery = `
    SELECT id 
    FROM degreeinfo
    WHERE hy_degree_id = $1 AND degree_years = $2`;

    const { rows: degreeRows } = await pool.query(degreeQuery, [degreeCode, degreeYears]);

    if (degreeRows.length === 0) {
      return false;
    }
    logger.info('degreeRows[0]', degreeRows[0])
    return degreeRows;
  } catch (error) {
    console.error("Error in getDegreeId:", error);
    return false;
  }
};

const getDegreeinfo = async (degreeId) => {
  //TODO, connect to route
  try {
    const infoQuery = `
    SELECT id, degree_name, hy_degree_id, degree_years
    FROM degreeinfo
    WHERE id = $1`;

    const {infoRows } = await pool.query(infoQuery, [degreeId]);

    if (infoRows.length === 0) {
      return false;
    }
    return infoRows;
  } catch (error) {
    console.error("Error in getDegreeinfo", error);
    return false;
  }
};


const savePositions = async (degreeId, coursePositions) => {
  try {
    await pool.query('DELETE FROM course_positions WHERE degree_id = $1', [degreeId]);
    const courseIds = coursePositions.map(course => course.id);
    const courseQuery = `
      SELECT id, hy_course_id
      FROM courses
      WHERE hy_course_id = ANY($1)`;
  
    const { rows: courseRows } = await pool.query(courseQuery, [courseIds]);
  
    if (courseRows.length !== coursePositions.length) {
      return false;
    }
  
    let insertValues = '';
    coursePositions.forEach(position => {
      const matchingCourse = courseRows.find(course => course.hy_course_id === position.id);
      if (matchingCourse) {
          insertValues += `(${degreeId}, ${matchingCourse.id}, ${position.position.x}, ${position.position.y}), `;
      }
    });
  
    insertValues = insertValues.slice(0, -2);
  
    const insertQuery = `
      INSERT INTO course_positions(degree_id, course_id, x, y)
      VALUES ${insertValues}`;
    await pool.query(insertQuery);
    return true
  } catch (error) {
      console.error('Error saving positions:', error);
      return false
  }
};

const resetPositions = async ( degreeId ) => {
  const resetQuery = `DELETE FROM course_positions WHERE degree_id = $1`;
  await pool.query(resetQuery, [degreeId]);}


module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
  getAllCoursesWithPrerequisites,
  fetchCourseWithPrerequisites,
  addPrerequisiteCourse,
  getCourses,
  getCourseWithReqursivePrerequisites,
  addCourse,
  addManyCourses,
  addManyPrerequisiteCourses,
  addCourseAndPrerequisitesToStudyplan,
  addDegreeinfo,
  addSingleDegreeinfo,
  resetPositions,
  getDegreeNames,
  getDegreeinfo,
  getDegreeinfoId,
  getPlansByRoot,
  getPlansByRootAndUser,
  createStudyPlan,
  addStudyPlan,
  addUserPlanRelation,
  savePositions,
  getCoursesByPlan,
  endDatabase: async () => {
    await pool.end();
  },
};

