/* factory reset*/
DROP DATABASE IF EXISTS feedbacker;
DROP ROLE IF EXISTS dbadm;
DROP TABLE IF EXISTS accounts;
DROP PROCEDURE IF EXISTS create_account;
DROP FUNCTION IF EXISTS check_login_credentials;
DROP EXTENSION IF EXISTS pgcrypto;

CREATE DATABASE feedbacker;

CREATE ROLE dbadm LOGIN PASSWORD 'dbadm';
ALTER ROLE dbadm WITH SUPERUSER;

CREATE EXTENSION pgcrypto;

CREATE TYPE ROLES AS ENUM('admin', 'user', 'agent');

/* tables */
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ROLES
);

/* procedures*/
CREATE PROCEDURE create_account(
    username VARCHAR(255),
    fullname VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    role ROLES
)
LANGUAGE SQL
AS $$
    INSERT INTO accounts (username, fullname, email, password, role)
    VALUES (username, fullname, email, crypt(password, gen_salt('bf')), role::ROLES);
$$;

CREATE FUNCTION check_login_credentials(
    user_email VARCHAR(255),
    user_password VARCHAR(255)
)
RETURNS TABLE (id INT, role ROLES)
LANGUAGE SQL
AS $$
    SELECT id, role
    FROM accounts
    WHERE email = user_email 
    AND password = crypt(user_password, password);
$$;
