/* factory reset */
DO $$
BEGIN
    PERFORM pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = 'feedbacker'
      AND pid <> pg_backend_pid();
END $$;

DROP ROLE IF EXISTS dbadm;

DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS surveys;
DROP TABLE IF EXISTS accounts;


DROP EXTENSION IF EXISTS pgcrypto;

\c postgres
DROP DATABASE IF EXISTS feedbacker;

CREATE DATABASE feedbacker;
\c feedbacker

CREATE ROLE dbadm LOGIN PASSWORD 'dbadm';
ALTER ROLE dbadm WITH SUPERUSER;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'roles') THEN
        CREATE TYPE ROLES AS ENUM('admin', 'operator');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'traffic_lights') THEN
        CREATE TYPE TRAFFIC_LIGHTS AS ENUM('red', 'yellow', 'green');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'answer_types') THEN
        CREATE TYPE ANSWER_TYPES AS ENUM('freetext', 'truefalse', 'scale', 'trafficlight');
    END IF;
END $$;

/* tables */
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ROLES DEFAULT 'operator',
    verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255)
    token VARCHAR(64)
);

CREATE TABLE surveys (
    id SERIAL PRIMARY KEY,
    creator INT REFERENCES accounts(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    survey_id INT REFERENCES surveys(id),
    question TEXT NOT NULL,
    answer_type ANSWER_TYPES NOT NULL        /* FreeText, TrueFalse, Scale, TrafficLight */
);

CREATE TABLE answers
(
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id),
    yes_no_answer BOOLEAN,
    scale_answer INT CHECK (scale_answer BETWEEN 1 AND 5),
    text_answer TEXT,
    traffic_light_answer TRAFFIC_LIGHTS,
    answer_type ANSWER_TYPES NOT NULL        
);

\i procedures.sql