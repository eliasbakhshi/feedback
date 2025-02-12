/* factory reset*/
DROP DATABASE IF EXISTS feedbacker;
DROP ROLE IF EXISTS dbadm;
DROP TABLE IF EXISTS accounts;
DROP PROCEDURE IF EXISTS create_account;
DROP EXTENSION IF EXISTS pgcrypto;

CREATE DATABASE feedbacker;

CREATE ROLE dbadm LOGIN PASSWORD 'dbadm';
ALTER ROLE dbadm WITH SUPERUSER;

CREATE EXTENSION pgcrypto;

/* tables */
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL
);

/* procedures*/
CREATE PROCEDURE create_account(
    username VARCHAR(255),
    fullname VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(10)
)
LANGUAGE SQL
AS $$
    INSERT INTO accounts (username, fullname, email, password, role)
    VALUES (username, fullname, email, crypt(password, gen_salt('bf')), role);
$$;