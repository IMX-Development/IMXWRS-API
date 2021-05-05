CREATE OR ALTER TRIGGER updateTempPassword
ON users FOR UPDATE AS 
BEGIN
	IF UPDATE(password) 
	BEGIN 
		UPDATE users SET temporal = NULL WHERE username = users.username;
		
		OPEN SYMMETRIC KEY IMXWRS_Key_01  
   		DECRYPTION BY CERTIFICATE IMXWRSCERT;
		
		UPDATE users
		SET encPassword = EncryptByKey(Key_GUID('IMXWRS_Key_01'), password)
		WHERE username = users.username;  
	END
END
