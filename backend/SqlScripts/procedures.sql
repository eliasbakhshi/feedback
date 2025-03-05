DROP PROCEDURE IF EXISTS create_account;
DROP PROCEDURE IF EXISTS create_survey;
DROP PROCEDURE IF EXISTS add_question;

DROP FUNCTION IF EXISTS check_login_credentials;


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
    question TEXT
)
LANGUAGE SQL
AS $$
    INSERT INTO questions (survey_id, question)
    VALUES (survey_id, question);
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