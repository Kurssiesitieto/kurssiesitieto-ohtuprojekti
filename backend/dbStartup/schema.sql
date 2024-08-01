CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    kori_id VARCHAR(50) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    hy_course_id VARCHAR(50) NOT NULL,
    CONSTRAINT unique_course_kori_name UNIQUE (kori_id),
    CONSTRAINT unique_hy_course_id UNIQUE (hy_course_id)
);

CREATE TABLE IF NOT EXISTS degrees (
    id SERIAL PRIMARY KEY,
    degree_name VARCHAR(255) NOT NULL,
    hy_degree_id VARCHAR(50) NOT NULL,
    degree_years VARCHAR(25) NOT NULL,
    CONSTRAINT unique_year_for_hy_course_id UNIQUE (hy_degree_id, degree_years),
    CONSTRAINT degree_name_unique UNIQUE (degree_name)
);

CREATE TABLE IF NOT EXISTS degreeinfo (
    id SERIAL PRIMARY KEY,
    degree_name VARCHAR(255) NOT NULL,
    hy_degree_id VARCHAR(50) NOT NULL,
    degree_years VARCHAR(25) NOT NULL,
    CONSTRAINT unique_year_for_hy_course_id_new UNIQUE (hy_degree_id, degree_years),
    CONSTRAINT unique_degree_names UNIQUE (degree_name)
);

CREATE TABLE IF NOT EXISTS studyplans (
    id SERIAL PRIMARY KEY,
    degree_id INT NOT NULL REFERENCES degreeinfo(id),
    name VARCHAR(255) NOT NULL,
    CONSTRAINT unique_studyplan_names UNIQUE (name) 
);

CREATE TABLE IF NOT EXISTS user_plan_relation (
    id SERIAL PRIMARY KEY,
    uid VARCHAR(50) DEFAULT 'root',
    plan_id INT NOT NULL REFERENCES studyplans(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS course_plan_relation (
    id SERIAL PRIMARY KEY,
    plan_id INT NOT NULL REFERENCES studyplans(id),
    course_id INT NOT NULL REFERENCES courses(id),
    relation_type VARCHAR(50) DEFAULT 'compulsory', --compulsory", "alternative" or "optional"
    CONSTRAINT unique_course_plan_relation UNIQUE (plan_id, course_id)
);

CREATE TABLE IF NOT EXISTS course_degree_relation (
    id SERIAL PRIMARY KEY,
    degree_id INT NOT NULL REFERENCES degrees(id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    relation_type VARCHAR(50) DEFAULT 'compulsory',  --"compulsory", "alternative" or "optional"
    CONSTRAINT unique_course_degree_relation UNIQUE (degree_id, course_id)
);

CREATE TABLE IF NOT EXISTS prerequisite_courses (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    prerequisite_course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT unique_course_prerequisite UNIQUE (course_id, prerequisite_course_id),
    CONSTRAINT no_self_prerequisite CHECK (course_id != prerequisite_course_id)
);

CREATE TABLE IF NOT EXISTS course_positions (
    id SERIAL PRIMARY KEY,
    degree_id INT NOT NULL REFERENCES degrees(id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    x INT NOT NULL,
    y INT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prerequisite_course_id ON prerequisite_courses(course_id);
CREATE INDEX IF NOT EXISTS idx_course_degree_relation_id ON course_degree_relation(degree_id);
