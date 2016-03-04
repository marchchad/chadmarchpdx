DELIMITER $
DROP PROCEDURE IF EXISTS get_admin_data $
CREATE PROCEDURE get_admin_data()
BEGIN
	select id, Name as name from recipes;
    select k.kegsessionid, k.kegid from kegs k;
END$