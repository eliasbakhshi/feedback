/* factory reset*/
DROP DATABASE IF EXISTS feedbacker;
DROP ROLE IF EXISTS dbadm;
DROP TABLE IF EXISTS accounts;
DROP EXTENSION IF EXISTS pgcrypto;

CREATE DATABASE feedbacker;

CREATE ROLE dbadm LOGIN PASSWORD 'dbadm';
ALTER ROLE dbadm WITH SUPERUSER;

CREATE EXTENSION pgcrypto;

CREATE TYPE ROLES AS ENUM('admin', 'operator');

/* tables */
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ROLES DEFAULT 'operator'
);

\i procedures.sql