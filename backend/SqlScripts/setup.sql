/* factory reset */

DROP ROLE IF EXISTS dbadm;
DROP TABLE IF EXISTS accounts;
DROP PROCEDURE IF EXISTS create_account;
DROP FUNCTION IF EXISTS check_login_credentials;
DROP EXTENSION IF EXISTS pgcrypto;

\c postgres
DROP DATABASE IF EXISTS feedbacker;

CREATE DATABASE feedbacker;
\c feedbacker

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

/* procedures */
CREATE PROCEDURE create_account(
    fullname VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    role ROLES DEFAULT 'operator'
)
LANGUAGE SQL
AS $$
    INSERT INTO accounts (fullname, email, password, role)
    VALUES (fullname, email, crypt(password, gen_salt('bf')), role::ROLES);
$$;

/* functions */
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
