DROP PROCEDURE IF EXISTS create_account;
DROP FUNCTION IF EXISTS check_login_credentials;


/* procedures */
CREATE PROCEDURE create_account(
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    role ROLES
)
LANGUAGE SQL
AS $$
    INSERT INTO accounts ( firstname, lastname, email, password, role)
    VALUES ( firstname, lastname, email, crypt(password, gen_salt('bf')), role::ROLES);
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
