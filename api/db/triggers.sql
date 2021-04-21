CREATE TRIGGER updateTempPassword
ON users FOR UPDATE AS 
BEGIN
	IF UPDATE(password) 
	BEGIN 
		UPDATE users SET temporal = NULL WHERE username = users.username;
	END
END
