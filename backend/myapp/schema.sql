DROP TABLE USERS;

CREATE TABLE USERS
(
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Username VARCHAR(50) PRIMARY KEY,
    Password VARCHAR(40),
    Email VARCHAR(100)
);

INSERT INTO USERS (FirstName, LastName, Username, Password, Email)
VALUES ('John', 'Doe', 'johndoe', 'password123', 'john.doe@gmail.com');

INSERT INTO USERS (FirstName, LastName, Username, Password, Email)
VALUES ('Jane', 'Smith', 'janesmith', 'jsmithpass', 'jane.smith@yahoo.com');

INSERT INTO USERS (FirstName, LastName, Username, Password, Email)
VALUES ('Alex', 'Johnson', 'alexj', 'alexJ789', 'alex.johnson@hotmail.com');

INSERT INTO USERS (FirstName, LastName, Username, Password, Email)
VALUES ('Emily', 'Brown', 'emilyb', 'brownPass001', 'emily.brown@outlook.com');

