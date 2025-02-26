DROP PROCEDURE IF EXISTS create_account;
DROP PROCEDURE IF EXISTS update_password;

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

CREATE PROCEDURE update_password(
    IN userid INT,
    IN currentpassword VARCHAR,
    IN newpassword VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    storedpassword TEXT;
BEGIN
    SELECT password
    INTO storedpassword
    FROM accounts
    WHERE id = userid
      AND password = crypt(currentpassword, password);


    UPDATE accounts
    SET password = crypt(newpassword, gen_salt('bf'))
    WHERE id = userid;

END;
$$;
