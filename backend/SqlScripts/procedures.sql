DROP PROCEDURE IF EXISTS create_account;

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

CREATE OR REPLACE FUNCTION check_password(pass text)
  RETURNS integer
  LANGUAGE plpgsql
AS $$
DECLARE
    count integer;
BEGIN
    SELECT COUNT(*)
      INTO count
      FROM accounts
     WHERE password = crypt(pass, password);

    RETURN count; 
END;
$$;



CREATE OR REPLACE FUNCTION update_password(user_id int, new_pass text)
  RETURNS integer
  LANGUAGE plpgsql
AS $$
DECLARE
    affected int;
BEGIN
    UPDATE accounts
       SET password = crypt(new_pass, gen_salt('bf'))
     WHERE id = user_id;

    GET DIAGNOSTICS affected = ROW_COUNT;

    RETURN affected;
END;
$$;
