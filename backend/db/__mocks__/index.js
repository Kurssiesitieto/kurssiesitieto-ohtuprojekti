const addCourse = () => {
  return {
    id: 1,
    kori_id: "CS101",
    course_name: "Intro to CS",
    hy_course_id: "IntroCS101",
  };
};

const getCourses = () => {
  return [{
    id: 1,
    kori_id: "CS101",
    course_name: "Intro to CS",
    hy_course_id: "IntroCS101"
  }];
};

const deleteCourse = (kori_name) => {
  if (kori_name === "IntroCS101") {
    return 1
  } else {
    return 0
  }
};

const addPrerequisiteCourse = (course_hy_id, prerequisite_course_hy_id) => {
  if (course_hy_id !== prerequisite_course_hy_id) {
    return [course_hy_id, prerequisite_course_hy_id];
  } else {
    return [];
  }
};

const removePrerequisiteCourse = (course_hy_id, prerequisite_course_hy_id) => {
  if (course_hy_id !== prerequisite_course_hy_id) {
    return [course_hy_id, prerequisite_course_hy_id];
  } else {
    return [];
  }
};

const getDegreeId = (degreeId, degreeYears) => {
  console.log('@getDegreeId', degreeId, degreeYears)
  const degrees = [
    {
      "id":"1",
      "degree_name": "Matemaattisten tieteiden kandiohjelma 2023-2026",
      "hy_degree_id": "kh50_001",
      "degree_years": "2023-2026"
    }
  ]
  return degrees.id;
}

const getDegrees = (degreeCode, degreeYears) => {
  console.log('@getDegrees', degreeCode, degreeYears)
  const courses = [
    {
        "name": "Johdatus yliopistomatematiikkaan",
        "kori_id": "hy-CU-117375151",
        "identifier": "MAT11001",
        "type": "compulsory",
        "x": null,
        "y": null,
        "dependencies": []
    },
    {
        "name": "Tietorakenteet ja algoritmit I",
        "kori_id": "hy-CU-132986295",
        "identifier": "TKT200011",
        "type": "compulsory",
        "x": null,
        "y": null,
        "dependencies": [
            "TKT10003",
            "MAT11001"
        ]
    }
  ]
  return courses;
};

module.exports = {
  addCourse, getCourses, deleteCourse, addPrerequisiteCourse,
  removePrerequisiteCourse, getDegrees, getDegreeId
};
