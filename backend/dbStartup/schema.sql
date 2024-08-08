CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    kori_id VARCHAR(50) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    hy_course_id VARCHAR(50) NOT NULL,
    CONSTRAINT unique_course_kori_name UNIQUE (kori_id),
    CONSTRAINT unique_hy_course_id UNIQUE (hy_course_id)
);

CREATE TABLE IF NOT EXISTS degreeinfo (
    id SERIAL PRIMARY KEY,
    degree_name VARCHAR(255) NOT NULL,
    hy_degree_id VARCHAR(50) NOT NULL,
    degree_years VARCHAR(25) NOT NULL,
    CONSTRAINT unique_year_for_hy_degree_id UNIQUE (hy_degree_id, degree_years),
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

CREATE TABLE IF NOT EXISTS prerequisite_courses (
    id SERIAL PRIMARY KEY,
    plan_id INT NOT NULL REFERENCES studyplans(id),
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    prerequisite_course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT unique_course_prerequisite UNIQUE (plan_id, course_id, prerequisite_course_id),
    CONSTRAINT no_self_prerequisite CHECK (course_id != prerequisite_course_id)
);

CREATE TABLE IF NOT EXISTS course_positions (
    id SERIAL PRIMARY KEY,
    plan_id INT NOT NULL REFERENCES studyplans(id) ON DELETE CASCADE,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    x INT NOT NULL,
    y INT NOT NULL
);

-- Temporary fix to add data into database, to be used _only once_ on an 
-- empty database
-- Before first startup, remove /* */
-- After first startup, wrap all code below inside /*  */
/*
INSERT INTO degreeinfo (degree_name, hy_degree_id, degree_years)
VALUES ('Matemaattisten tieteiden kandiohjelma 2023-2026', 'kh50_001', '2023-2026');

DO $$
DECLARE
    last_studyplan_id INT;
    course_id_1 INT;
    course_id_2 INT;
    course_id_3 INT;
BEGIN
    INSERT INTO studyplans (degree_id, name)
    VALUES (lastval(), 'Matemaattisten tieteiden kandiohjelma 2023-2026')
    RETURNING id INTO last_studyplan_id;

    INSERT INTO user_plan_relation (uid, plan_id)
    VALUES ('root', last_studyplan_id);

    -- Check if the course already exists and get its id, otherwise insert a new course
    SELECT id INTO course_id_1 FROM courses WHERE hy_course_id = 'MAT11001';
    IF NOT FOUND THEN
        INSERT INTO courses (kori_id, course_name, hy_course_id)
        VALUES ('hy-CU-117375151', 'Johdatus yliopistomatematiikkaan', 'MAT11001')
        RETURNING id INTO course_id_1;
    END IF;

    SELECT id INTO course_id_2 FROM courses WHERE hy_course_id = 'MAT11002';
    IF NOT FOUND THEN
        INSERT INTO courses (kori_id, course_name, hy_course_id)
        VALUES ('hy-CU-117375394', 'Lineaarialgebra ja matriisilaskenta I', 'MAT11002')
        RETURNING id INTO course_id_2;
    END IF;

    -- Insert into course_plan_relation using the last inserted studyplan id
    INSERT INTO course_plan_relation (plan_id, course_id)
    VALUES (last_studyplan_id, course_id_1),
           (last_studyplan_id, course_id_2);

    -- Insert into prerequisite_courses using the last inserted studyplan id
    INSERT INTO prerequisite_courses (plan_id, course_id, prerequisite_course_id)
    VALUES (last_studyplan_id, course_id_2, course_id_1);

    SELECT id INTO course_id_3 FROM courses WHERE hy_course_id = 'MAT21001';
    IF NOT FOUND THEN
        INSERT INTO courses (kori_id, course_name, hy_course_id)
        VALUES ('hy-CU-117375754', 'Lineaarialgebra ja matriisilaskenta II', 'MAT21001')
        RETURNING id INTO course_id_3;
    END IF;

    INSERT INTO course_plan_relation (plan_id, course_id)
    VALUES (last_studyplan_id, course_id_3);

    INSERT INTO prerequisite_courses (plan_id, course_id, prerequisite_course_id)
    VALUES (last_studyplan_id, course_id_3, course_id_2);

END $$;

---TKT
INSERT INTO degreeinfo (degree_name, hy_degree_id, degree_years)
VALUES ('Tietojenkäsittelytieteen kandiohjelma 2023-2026', 'kh50_005', '2023-2026');

DO $$
DECLARE
    last_studyplan_id INT;
    course_id_1 INT;
    course_id_2 INT;
    course_id_3 INT;
BEGIN
    INSERT INTO studyplans (degree_id, name)
    VALUES (lastval(), 'Tietojenkäsittelytieteen kandiohjelma 2023-2026')
    RETURNING id INTO last_studyplan_id;

    INSERT INTO user_plan_relation (uid, plan_id)
    VALUES ('root', last_studyplan_id);

    -- Check if the course already exists and get its id, otherwise insert a new course
    SELECT id INTO course_id_1 FROM courses WHERE hy_course_id = 'TKT10002';
    IF NOT FOUND THEN
        INSERT INTO courses (kori_id, course_name, hy_course_id)
        VALUES ('hy-CU-118023867', 'Ohjelmoinnin perusteet', 'TKT10002')
        RETURNING id INTO course_id_1;
    END IF;

    SELECT id INTO course_id_2 FROM courses WHERE hy_course_id = 'TKT10003';
    IF NOT FOUND THEN
        INSERT INTO courses (kori_id, course_name, hy_course_id)
        VALUES ('hy-CU-118023947', 'Ohjelmoinnin jatkokurssi', 'TKT10003')
        RETURNING id INTO course_id_2;
    END IF;

    -- Insert into course_plan_relation using the last inserted studyplan id
    INSERT INTO course_plan_relation (plan_id, course_id)
    VALUES (last_studyplan_id, course_id_1),
           (last_studyplan_id, course_id_2);

    -- Insert into prerequisite_courses using the last inserted studyplan id
    INSERT INTO prerequisite_courses (plan_id, course_id, prerequisite_course_id)
    VALUES (last_studyplan_id, course_id_2, course_id_1);

    SELECT id INTO course_id_3 FROM courses WHERE hy_course_id = 'TKT10004';
    IF NOT FOUND THEN
        INSERT INTO courses (kori_id, course_name, hy_course_id)
        VALUES ('hy-CU-118023990', 'Tietokantojen perusteet', 'TKT10004')
        RETURNING id INTO course_id_3;
    END IF;

    INSERT INTO course_plan_relation (plan_id, course_id)
    VALUES (last_studyplan_id, course_id_3);

    INSERT INTO prerequisite_courses (plan_id, course_id, prerequisite_course_id)
    VALUES (last_studyplan_id, course_id_3, course_id_2);

END $$; */













