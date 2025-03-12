/* factory reset */
DO $$
BEGIN
    PERFORM pg_terminate_backend(pg_stat_activity.pid)
    FROM pg_stat_activity
    WHERE pg_stat_activity.datname = 'feedbacker'
      AND pid <> pg_backend_pid();
END $$;

DROP ROLE IF EXISTS dbadm;
DROP TABLE IF EXISTS accounts;
DROP EXTENSION IF EXISTS pgcrypto;

DROP PROCEDURE IF EXISTS add_token;
DROP FUNCTION IF EXISTS check_login_credentials;

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

/* tables */
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ROLES DEFAULT 'operator',
    token VARCHAR(64)
);

CREATE PROCEDURE create_account(
    fullname VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    role ROLES
)
LANGUAGE SQL
AS $$
    INSERT INTO accounts ( fullname, email, password, role)
    VALUES ( fullname, email, crypt(password, gen_salt('bf')), role::ROLES);
$$;

CREATE PROCEDURE add_token(
    new_token VARCHAR(64),
    userID INT
)
LANGUAGE SQL
AS $$
    UPDATE accounts
    SET token = new_token
    WHERE id = userID
$$;

CREATE FUNCTION get_hashed_token(
    userID INT
)
RETURNS VARCHAR(64)
LANGUAGE SQL
AS $$
    SELECT crypt(token, gen_salt('bf')) 
    FROM accounts 
    WHERE id = userID;
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

\i procedures.sql