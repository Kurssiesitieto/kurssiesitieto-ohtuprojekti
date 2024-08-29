const addCourse = () => {
  return {
    id: 1,
    kori_id: "CS101",
    course_name: "Intro to CS",
    hy_course_id: "IntroCS101",
  };
};

const mockGetCourseWithReqursivePrerequisites = jest.fn(() => {
  return Promise.resolve({
    //prerequisities for MAT21001 Lineaarialgebra ja matriisilaskenta II
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
});

const addPrerequisiteCourse = (course_hy_id, prerequisite_course_hy_id) => {
  if (course_hy_id !== prerequisite_course_hy_id) {
    return [course_hy_id, prerequisite_course_hy_id];
  } else {
    return [];
  }
};
/* OLD SCHEMA, replace with GetDegreeinfoId and fix
const mockGetDegreeId = jest.fn(() => {
  return Promise.resolve({
    rows: [
      {
        "id":"1",
        "degree_name": "Matemaattisten tieteiden kandiohjelma 2023-2026",
        "hy_degree_id": "kh50_001",
        "degree_years": "2023-2026"
      }
    ],
    rowcount: 1
  });
});
*/


module.exports = {
  addCourse,
  addPrerequisiteCourse,
  getCourseWithReqursivePrerequisites: mockGetCourseWithReqursivePrerequisites
};
