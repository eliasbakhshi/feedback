/* factory reset */
DO $$
BEGIN
    PERFORM pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = 'feedbacker'
      AND pid <> pg_backend_pid();
END $$;

DROP DATABASE IF EXISTS feedbacker;
DROP ROLE IF EXISTS dbadm;

DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS surveys;
DROP TABLE IF EXISTS accounts;


DROP EXTENSION IF EXISTS pgcrypto;

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

/* tables */
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ROLES DEFAULT 'operator'
);

\i procedures.sql