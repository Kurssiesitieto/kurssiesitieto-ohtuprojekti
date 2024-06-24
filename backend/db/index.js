require('dotenv').config();
const logger = require('../middleware/logger');
logger.info(`DATABASE_HOST: ${process.env.DATABASE_HOST}`);
logger.info(`DATABASE_PORT: ${process.env.DATABASE_PORT}`);
logger.info(`DATABASE_NAME: ${process.env.DATABASE_NAME}`);
const KoriInterface = require('../interfaces/koriInterface');


const { Pool } = require('pg');
const kori = new KoriInterface();

const getStarted = async () => {
    const result = await pool.query('SELECT * FROM degrees ORDER BY degree_name')
    return result;
};


const selectPool = () => {
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
  const { rows } = await pool.query('SELECT * FROM courses');
  return rows;
};

const deleteCourse = async (kori_name) => {
  const result = await pool.query('DELETE FROM course_info WHERE kori_name = $1 RETURNING *', [kori_name]);
  return result.rowCount;
};


const getCourseWithReqursivePrerequisites = async (course_hy_id) => {
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
            SELECT array_agg(pc.hy_course_id)
            FROM prerequisite_courses pr
            JOIN courses pc ON pr.prerequisite_course_id = pc.id
            WHERE pr.course_id = c.id
          ),
          '{}'::text[]
        ) AS dependencies
    FROM
        courses c
    LEFT JOIN
        prerequisite_courses pc ON c.id = pc.course_id
    WHERE
        c.hy_course_id = $1
    UNION 
    SELECT
        c.id,
        c.kori_id,
        c.course_name, 
        c.hy_course_id,
        pc.prerequisite_course_id,
        COALESCE(
          (
            SELECT array_agg(pc.hy_course_id)
            FROM prerequisite_courses pr
            JOIN courses pc ON pr.prerequisite_course_id = pc.id
            WHERE pr.course_id = c.id
          ),
          '{}'::text[]
        ) AS dependencies
    FROM
        courses c
    LEFT JOIN
        prerequisite_courses pc ON c.id = pc.course_id
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
  const { rows } = await pool.query(query, [course_hy_id]);
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

const addPrerequisiteCourse = async (course_hy_id, prerequisite_course_hy_id) => {
  const query = `
  INSERT INTO prerequisite_courses (course_id, prerequisite_course_id)
  SELECT c1.id, c2.id
  FROM (SELECT id FROM courses WHERE hy_course_id = $1) AS c1, 
       (SELECT id FROM courses WHERE hy_course_id = $2) AS c2
  ON CONFLICT ON CONSTRAINT unique_course_prerequisite DO NOTHING
  RETURNING *`;
  const { rows } = await pool.query(
    query,
    [course_hy_id, prerequisite_course_hy_id]
  );
  return rows[0];
};

const addManyPrequisiteCourses = async (listOfPrerequisites) => {
  /* Accepts list of objects that represents a course and its prerequisites.

  The expected format for the prerequisite object is for example:
  [
    {
      course: 'TKT20018',
      prerequisiteCourse: 'TKT10003',
      relationType: 'optional'
    },
    {
      course: 'TKT20018',
      prerequisiteCourse: 'TKT10004',
      relationType: 'optional'
    },
  ]
  */

  for (const prerequisite of listOfPrerequisites) {
    const { course, prerequisiteCourse } = prerequisite;
    try {
      const result = await addPrerequisiteCourse(course, prerequisiteCourse);
      if (result) {
        logger.info(`Prerequisite for course ${course} with prerequisite ${prerequisiteCourse} of type successfully added to the database.`);
      } else {
        logger.verbose(`No new prerequisite relation added for course ${course} with prerequisite ${prerequisiteCourse}. It might already exist.`);
      }
    } catch (err) {
      logger.error(`Error adding prerequisite for course ${course} with prerequisite ${prerequisiteCourse} to the database:`, err);
    }
  }
};

// Frontend is not fixed for this yet
const removePrerequisiteCourse = async (course_hy_id, prerequisite_course_hy_id) => {
  /* 
  Receives args course_id and prerequisite_course_id and removes the relation from the database. 
  The id's are like TKT10001, TKT10002 etc.
  */
  const { rowCount } = await pool.query(
    `DELETE FROM prerequisite_courses
    WHERE course_id = (SELECT id FROM courses WHERE courses.hy_course_id = $1) AND 
          prerequisite_course_id = (SELECT id FROM courses WHERE courses.hy_course_id = $2)`,
    [course_hy_id, prerequisite_course_hy_id]
  );

  if (rowCount === 0) {
    logger.error("No prerequisite was removed. Check if the specified relation exists.");
  } else {
    logger.info("Prerequisite removed successfully.");
  }
};

// Complex, need to move them to a separate file later!

// Fetches a course and all it's required courses recursively.
async function fetchCourseWithPrerequisites(courseKoriName) {
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

const addCourseToDegree = async (hyDegreeId, degreeYears, hyCourseId, relationType = 'compulsory') => {
  try {
    const { rows } = await pool.query(
      `INSERT INTO course_degree_relation (degree_id, course_id, relation_type)
      VALUES (
        (SELECT id FROM degrees WHERE hy_degree_id = $1 AND degree_years = $2),
        (SELECT id FROM courses WHERE hy_course_id = $4),
        $3
      )
      ON CONFLICT ON CONSTRAINT no_duplicate_course_degree_relation DO NOTHING
      RETURNING *;`,
      [hyDegreeId, degreeYears, relationType, hyCourseId]
    );

    if (rows.length === 0) {
      logger.verbose(`Course ${hyCourseId} already exists in the degree ${hyDegreeId}.`);
      return;
    }
    return rows[0];
  } catch (error) {
    logger.verbose('Error inserting data into course_degree_relation table:', error);
  }
}

const addDdegree = async (degreeCode, degreeName, degreeYears) => {

  // Workaround for now. 'ON CONSTRAINT' works with one constraint only without some tomfoolery.
  const degreeNameIsNotUnique = async (degreeName) => {
    const { rows } = await pool.query(
      `SELECT EXISTS (
          SELECT 1
          FROM degrees
          WHERE degree_name = $1
      ) AS degreeExists`,
      [degreeName]
    );
    const { degreeExists } = rows[0];
    return degreeExists;
  };

  const nameInUse = await degreeNameIsNotUnique(degreeName)
  if (nameInUse) {
    logger.verbose(`Degree ${degreeName} already exists in the database.`);
    return;
  }

  const { rows } = await pool.query(
    `INSERT INTO degrees (degree_name, hy_degree_id, degree_years)
    SELECT $1, $2, $3
    ON CONFLICT ON CONSTRAINT unique_year_for_hy_course_id DO NOTHING
    RETURNING *`,
    [degreeName, degreeCode, degreeYears]
  );
  if (rows.length === 0) {
    logger.verbose(`Degree '${degreeName}' already exists in the database.`);
    return;
  }
  return;
};

const addDegreeData = async (degreeInfo, courseMappings) => {
  /*
  Adds json data to database. 

  degreeInfo format: 
  {
    degreeName: 'Tietojenkäsittelytieteen kandidaattitutkinto 2023-2026',
    degreeCode: 'kh50_05',
    degreeYears: '2023-2026'
  }

  courseCodes format:
  ['TKT10001', 'TKT10002', 'TKT10003']
  */

  const { degreeName, degreeYears, degreeCode } = degreeInfo;
  await addDdegree(degreeCode, degreeName, degreeYears);
  await Promise.all(courseMappings.map(async course => {
    await addCourseToDegree(degreeCode, degreeYears, course.course, course.courseType || 'compulsory');
    }))
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

const getDegrees = async ( degreeCode, degreeYears ) => {
  const query = `SELECT id FROM degrees WHERE hy_degree_id = $1 AND degree_years = $2`;
  const { rows } = await pool.query(
    query, [degreeCode, degreeYears]
  );

  let degreeId = rows[0].id;
  const query2 = `
    SELECT 
      c.course_name AS name, 
      c.kori_id, 
      c.hy_course_id AS identifier, 
      cdr.relation_type AS type,
      cp.x AS x,
      cp.y AS y,
      COALESCE(
        (
          SELECT array_agg(pc.hy_course_id)
          FROM prerequisite_courses pr
          JOIN courses pc ON pr.prerequisite_course_id = pc.id
          WHERE pr.course_id = c.id
        ),
        '{}'::text[]
      ) AS dependencies
    FROM course_degree_relation cdr
    JOIN courses c ON cdr.course_id = c.id
    LEFT JOIN course_positions cp ON cp.degree_id = cdr.degree_id AND cp.course_id = cdr.course_id
    WHERE cdr.degree_id = $1
  `;

  const { rows: courses } = await pool.query(
    query2, [degreeId]
  );
  return courses;
};

const getDegreeId = async (degreeId, degreeYears) => {
  try {  
    const degreeQuery = `
    SELECT id 
    FROM degrees 
    WHERE hy_degree_id = $1 AND degree_years = $2`;

    const { rows: degreeRows } = await pool.query(degreeQuery, [degreeId, degreeYears]);

    if (degreeRows.length === 0) {
      return false;
    }
    return degreeRows.id;
  } catch (error) {
    console.error("Error in getDegreeId:", error);
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
  removePrerequisiteCourse,
  getCourses,
  getCourseWithReqursivePrerequisites,
  addCourse,
  addManyCourses,
  addManyPrequisiteCourses,
  addDegreeData,
  resetPositions,
  //updateCourse,
  getDegrees,
  getStarted,
  getDegreeId,
  savePositions,
  deleteCourse,
  endDatabase: async () => {
    await pool.end();
  },
};

/*
exports.query = (text, params, callback) => {
  return pool.query(text, params, callback)
}

export async function getCourses() {
  const { rows } = await pool.query('SELECT * FROM Courses');
  return rows;
}

export async function endDatabase() {
  await pool.end();
}
*/
