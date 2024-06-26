// needed for (?): 'const { Pool } = require('pg')
jest.mock('pg', () => {
  const mockQuery = jest.fn((sql) => {
    //implementation for getStarted
    if (sql.includes('SELECT * FROM degrees ORDER BY degree_name')) {
      return Promise.resolve({
        rows: [
          {
              "degree_name": "Matemaattisten tieteiden kandiohjelma 2023-2026",
              "degree_years": "2023-2026",
              "hy_degree_id": "kh50_001"
          },
          {
              "degree_name": "Tietojenkäsittelytieteen kandidaattitutkinto 2023-2026",
              "degree_years": "2023-2026",
              "hy_degree_id": "kh50_005"
          }
        ],
        rowCount: 2
      });
    //implementation for getCourseWithReqursivePrerequisites  
    } else if (sql[0].includes('WITH RECURSIVE PrerequisitePath AS')) {
      return Promise.resolve({
        rows: [
          {
            "id": "10",
            "kori_id": "hy-CU-117375394",
            "course_name": "Lineaarialgebra ja matriisilaskenta I",
            "identifier": "MAT11002",
            "dependencies": [
              "MAT11001"
            ]
          },
          {
            "id": "5",
            "kori_id": "hy-CU-117375151",
            "course_name": "Johdatus yliopistomatematiikkaan",
            "hy_course_id": "MAT11001",
            "dependencies": []
          },
          {
            "id": "16",
            "kori_id": "hy-CU-117375754",
            "course_name": "Lineaarialgebra ja matriisilaskenta II",
            "identifier": "MAT21001",
            "dependencies": [
              "MAT11002"
            ]
          }
        ],
        rowcount: 3
      });
    //default implementation
    } else {
      return Promise.resolve ({
        rows: [
          { 
            id: 1,
            kori_id: 'CS101',
            course_name: 'Intro to CS',
            hy_course_id: 'IntroCS101' 
          }
        ],
        rowCount: 1
      });
    }

  });
  return {
    Pool: jest.fn(() => ({
      query: mockQuery,
    })),
  };
  /* //the original return, before mock was altered to serve other queries
  return {
    Pool: jest.fn(() => ({
      query: mockQuery.mockResolvedValueOnce(
        { 
          rows: [
            { 
              id: 1,
              kori_id: 'CS101',
              course_name: 'Intro to CS',
              hy_course_id: 'IntroCS101' 
            }
          ],
          rowCount: 1
        }
      ),
    })),
  }; */
}); 

// needed for (?): 'const KoriInterface = require('../interfaces/koriInterface)
jest.mock('../interfaces/koriInterface', () => {
  return jest.fn().mockImplementation(() => ({
    searchCourses: jest.fn().mockResolvedValue({
      searchResults: [
        {
          name: 'Intro to CS',
          groupId: 'CS101',
          code: 'IntroCS101'
        }
      ]
    })
  }));
});

const db = require('./index');
const KoriInterface = require('../interfaces/koriInterface');


describe('Database operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    KoriInterface.prototype.searchCourses = jest.fn().mockResolvedValue({
      searchResults: [
        {
          name: 'Intro to CS',
          groupId: 'CS101',
          code: 'IntroCS101'
        }
      ]
    });
  });

  describe('getStarted', () => {
    
    it('should return degrees from database', async () => {
      const expected = {
        rows: [
          {
              "degree_name": "Matemaattisten tieteiden kandiohjelma 2023-2026",
              "degree_years": "2023-2026",
              "hy_degree_id": "kh50_001"
          },
          {
              "degree_name": "Tietojenkäsittelytieteen kandidaattitutkinto 2023-2026",
              "degree_years": "2023-2026",
              "hy_degree_id": "kh50_005"
          }
        ],
        rowCount: 2
      };
      const result = await db.getStarted();
      expect(result).toEqual(expected);
    });
  });

  describe('getDegreeId', () => {
    it('should retrieve degreeid from database', async () => {
      const mockDegrees = [
        {
          "id":"1",
          "degree_name": "Matemaattisten tieteiden kandiohjelma 2023-2026",
          "hy_degree_id": "kh50_001",
          "degree_years": "2023-2026"
        }
      ];

      require('pg').Pool().query.mockResolvedValueOnce(
        { rows: mockDegrees, rowCount: mockDegrees.length });
  
      const result = await db.getDegreeId();
  
      expect(result.id).toEqual(mockDegrees.id);
      expect(require('pg').Pool().query).toHaveBeenCalledTimes(1);

    });
  });
  // --- Courses ---
  
  describe('addCourse', () => {
    it('should insert a course into the database and return the inserted course', async () => {
      const mockCourse = {
        id: 1,
        kori_id: 'CS101',
        course_name: 'Intro to CS',
        hy_course_id: 'IntroCS101'
      };
  
      require('pg').Pool().query.mockResolvedValueOnce({ rows: [mockCourse], rowCount: 1 });
  
      const addedCourseCode = 'Intro to CS';
      const result = await db.addCourse(addedCourseCode);
  
      expect(result).toEqual(mockCourse);
      expect(normalizeSql(require('pg').Pool().query.mock.calls[0][0])).toEqual(normalizeSql(
        `INSERT INTO courses (kori_id, course_name, hy_course_id)
        SELECT $1, $2, $3
        ON CONFLICT (kori_id) DO NOTHING
        RETURNING *`
      ));
      expect(require('pg').Pool().query.mock.calls[0][1]).toEqual([
        mockCourse.kori_id,
        mockCourse.course_name,
        mockCourse.hy_course_id
        ]
      );
    });
  });

  describe('getCourses', () => {
    it('should retrieve all courses from the database', async () => {
      const mockCourses = [
        { 
          id: 1,
          kori_id: 'CS101',
          course_name: 'Intro to CS',
          hy_course_id: 'IntroCS101'
        }
      ];
  
      require('pg').Pool().query.mockResolvedValueOnce(
        { rows: mockCourses, rowCount: mockCourses.length });
  
      const result = await db.getCourses();
  
      expect(result).toEqual(mockCourses);
      expect(require('pg').Pool().query).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course from the database and return the rowCount', async () => {
      require('pg').Pool().query.mockResolvedValueOnce({ rowCount: 1 });
  
      const kori_name = 'IntroCS101';
      const result = await db.deleteCourse(kori_name);
  
      expect(result).toBe(1);
      expect(require('pg').Pool().query).toHaveBeenCalledWith(
        'DELETE FROM course_info WHERE kori_name = $1 RETURNING *',
        [kori_name]
      );
    });
  });
  
  // --- Prerequisites ---

  describe('addPrerequisiteCourse', () => {
    it('should insert a prerequisite course relation into the database and return the inserted relation', async () => {
      const mockRelation = { course_kori_name: 'AdvCS102', prerequisite_course_kori_name: 'IntroCS101' };
      require('pg').Pool().query.mockResolvedValueOnce({ rows: [mockRelation], rowCount: 1 });
  
      await db.addPrerequisiteCourse(mockRelation.course_kori_name, mockRelation.prerequisite_course_kori_name);
      
      // Normalize the SQL query for comparison
      const expectedSql = normalizeSql(`
        INSERT INTO prerequisite_courses (course_id, prerequisite_course_id)
        SELECT c1.id, c2.id
        FROM (SELECT id FROM courses WHERE hy_course_id = $1) AS c1,
             (SELECT id FROM courses WHERE hy_course_id = $2) AS c2
        ON CONFLICT ON CONSTRAINT unique_course_prerequisite DO NOTHING
        RETURNING *
      `);
      const actualSql = normalizeSql(require('pg').Pool().query.mock.calls[0][0]);
  
      expect(actualSql).toEqual(expectedSql);
      expect(require('pg').Pool().query.mock.calls[0][1]).toEqual([mockRelation.course_kori_name, mockRelation.prerequisite_course_kori_name]);
    });
  });

  describe('removePrerequisiteCourse', () => {
    it('should remove a prerequisite course relation from the database', async () => {
      require('pg').Pool().query.mockResolvedValueOnce({ rowCount: 1 });
  
      const course_hy_id = 'AdvCS102';
      const prerequisite_course_hy_id = 'IntroCS101';
      await db.removePrerequisiteCourse(course_hy_id, prerequisite_course_hy_id);
      
      const expectedSql = normalizeSql(`DELETE FROM prerequisite_courses WHERE course_id = (SELECT id FROM courses WHERE courses.hy_course_id = $1) AND prerequisite_course_id = (SELECT id FROM courses WHERE courses.hy_course_id = $2)`);
      const actualSql = normalizeSql(require('pg').Pool().query.mock.calls[0][0]);
  
      expect(actualSql).toEqual(expectedSql);
      expect(require('pg').Pool().query.mock.calls[0][1]).toEqual([course_hy_id, prerequisite_course_hy_id]);
    });
  });

  describe('getCourseWithReqursivePrerequisites', () => {
    it('should find recursively all prerequisite courses for a given course', async () => {
      const mockCourses = {
        rows: [
          {
            "id": "10",
            "kori_id": "hy-CU-117375394",
            "course_name": "Lineaarialgebra ja matriisilaskenta I",
            "identifier": "MAT11002",
            "dependencies": [
              "MAT11001"
            ]
          },
          {
            "id": "5",
            "kori_id": "hy-CU-117375151",
            "course_name": "Johdatus yliopistomatematiikkaan",
            "hy_course_id": "MAT11001",
            "dependencies": []
          },
          {
            "id": "16",
            "kori_id": "hy-CU-117375754",
            "course_name": "Lineaarialgebra ja matriisilaskenta II",
            "identifier": "MAT21001",
            "dependencies": [
              "MAT11002"
            ]
          }
        ],
        rowcount: 3
      };
      const hy_course_id = "MAT21001";
      require('pg').Pool().query.mockResolvedValueOnce(
        { rows: mockCourses, rowCount: mockCourses.length });
      const response = await db.getCourseWithReqursivePrerequisites(hy_course_id);
      expect(response).toEqual(mockCourses);
      expect(require('pg').Pool().query).toHaveBeenCalledTimes(1);
    });
  });
});

// Generated by chatGPT, helper function used to deal with whitespace in SQL queries
// A utility function to normalize SQL queries by compressing all whitespace down to single spaces
const normalizeSql = (sql) => sql.replace(/\s+/g, ' ').trim();