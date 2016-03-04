DELIMITER $
DROP PROCEDURE IF EXISTS get_users $
CREATE PROCEDURE get_users()
BEGIN
	SELECT
		userid,
		username,
		email,
		role
	FROM ipaapi.users;
END$