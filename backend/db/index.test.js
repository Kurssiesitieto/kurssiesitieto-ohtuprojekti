// needed for (?): 'const { Pool } = require('pg')
jest.mock('pg', () => {
  const mockQuery = jest.fn();
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
  };
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
const { describe } = require('mocha');


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

  //TODO: add test for addManyCourses (if humanly possible)

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

  //TODO: add test for addManyPrequisiteCourses (if humanly possible)
  
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
});

// Generated by chatGPT, helper function used to deal with whitespace in SQL queries
// A utility function to normalize SQL queries by compressing all whitespace down to single spaces
const normalizeSql = (sql) => sql.replace(/\s+/g, ' ').trim();