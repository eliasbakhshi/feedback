DROP PROCEDURE IF EXISTS create_account;
DROP PROCEDURE IF EXISTS create_survey;
DROP PROCEDURE IF EXISTS add_question;
DROP FUNCTION IF EXISTS get_hashed_token;

DROP FUNCTION IF EXISTS add_token;
DROP FUNCTION IF EXISTS check_login_credentials;
DROP FUNCTION IF EXISTS check_token;

DROP FUNCTION IF EXISTS get_user_surveys;
DROP FUNCTION IF EXISTS get_user_survey;


/* procedures */
CREATE PROCEDURE create_account(
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    role ROLES,
    verification_token VARCHAR
)
LANGUAGE SQL
AS $$
    INSERT INTO accounts ( firstname, lastname, email, password, role, verified, verification_token)
    VALUES ( firstname, lastname, email, crypt(password, gen_salt('bf')), role::ROLES, FALSE, verification_token);
$$;

CREATE PROCEDURE create_survey(
    creator INT,
    title VARCHAR(255),
    description TEXT
)
LANGUAGE SQL
AS $$
    INSERT INTO surveys (creator, title, description)
    VALUES (creator, title, description);
$$;

CREATE PROCEDURE add_question(
    survey_id INT,
    question TEXT,
    answer_type ANSWER_TYPES
)
LANGUAGE SQL
AS $$
    INSERT INTO questions (survey_id, question, answer_type)
    VALUES (survey_id, question, answer_type);
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
    AND password = crypt(user_password, password)
    AND verified = TRUE;
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

CREATE FUNCTION get_user_surveys(userId INT)
RETURNS TABLE (id INT, title VARCHAR(255), description TEXT, created_at TIMESTAMP)
LANGUAGE SQL
AS $$
    SELECT id, title, description, created_at
    FROM surveys
    WHERE creator = userId
    ORDER BY created_at DESC;
$$;

CREATE FUNCTION get_user_survey(userId INT, survey_id INT)
RETURNS TABLE (id INT, title VARCHAR(255), description TEXT, created_at TIMESTAMP)
LANGUAGE SQL
AS $$
    SELECT id, title, description, created_at
    FROM surveys
    WHERE creator = userId AND id = survey_id;
$$;

CREATE FUNCTION check_token(userId INT, token_to_check VARCHAR(64))
RETURNS BOOLEAN
LANGUAGE SQL
AS $$
    SELECT token_to_check = crypt(token, token_to_check)
    FROM accounts
    WHERE id = userID;
$$;
