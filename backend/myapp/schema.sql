DROP TABLE USERS;
DROP TABLE STUDYGROUP;
DROP TABLE COURSE;
DROP TABLE MAJORS;
DROP TABLE RequestType;
DROP TABLE RequestStatus;
DROP TABLE Request;
DROP TABLE UserGroups;

CREATE TABLE USERS
(
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Username VARCHAR(50) PRIMARY KEY,
    Password VARCHAR(100),
    Email VARCHAR(100)
);

CREATE TABLE STUDYGROUP
(
    Name VARCHAR(50) PRIMARY KEY,
    MemberLimit INTEGER(4),
    OwnerUsername VARCHAR(50)
);

CREATE TABLE COURSE
(
    Name VARCHAR(50) PRIMARY KEY,
    CourseNumber INTEGER(4),
    DeptName VARCHAR(5)
);

CREATE TABLE MAJORS
(
    Name VARCHAR(50) PRIMARY KEY,
    FacultyName VARCHAR(50)
);

CREATE TABLE RequestType (
                             RequestTypeId SERIAL PRIMARY KEY,
                             Type TEXT NOT NULL -- Example values: 'JoinGroup', 'StartConversation'
);

CREATE TABLE RequestStatus (
                               StatusId SERIAL PRIMARY KEY,
                               Status TEXT NOT NULL
);

CREATE TABLE Request (
                         RequestId SERIAL PRIMARY KEY,
                         RequestTypeId INTEGER NOT NULL,
                         RecipientUserId INTEGER NOT NULL,
                         SenderUserId INTEGER NOT NULL,
                         StatusId INTEGER NOT NULL,
                         GroupId INTEGER NOT NULL,
                         Message TEXT,
                         FOREIGN KEY (RequestTypeId) REFERENCES RequestType(RequestTypeId),
                         FOREIGN KEY (StatusId) REFERENCES RequestStatus(StatusId),
                         FOREIGN KEY (SenderUserId) REFERENCES USERS(Username)
);

CREATE TABLE UserGroups (
                         Username VARCHAR(50) NOT NULL,
                         Name VARCHAR(50) NOT NULL,
                         PRIMARY KEY (Username, Name),
                         FOREIGN KEY (Username) REFERENCES USERS(Username),
                         FOREIGN KEY (Name) REFERENCES STUDYGROUP(Name)
);


INSERT INTO USERS (FirstName, LastName, Username, Password, Email)
VALUES ('John', 'Doe', 'johndoe', 'password123', 'john.doe@gmail.com');

INSERT INTO USERS (FirstName, LastName, Username, Password, Email)
VALUES ('Jane', 'Smith', 'janesmith', 'jsmithpass', 'jane.smith@yahoo.com');

INSERT INTO USERS (FirstName, LastName, Username, Password, Email)
VALUES ('Alex', 'Johnson', 'alexj', 'alexJ789', 'alex.johnson@hotmail.com');

INSERT INTO USERS (FirstName, LastName, Username, Password, Email)
VALUES ('Emily', 'Brown', 'emilyb', 'brownPass001', 'emily.brown@outlook.com');

INSERT INTO STUDYGROUP (Name, MemberLimit, OwnerUsername)
VALUES ('Data Science Enthusiasts', 10, 'emilyb');

INSERT INTO STUDYGROUP (Name, MemberLimit, OwnerUsername)
VALUES ('AI and Machine Learning', 15, 'alexj');

INSERT INTO STUDYGROUP (Name, MemberLimit, OwnerUsername)
VALUES ('Web Development Wizards', 12, 'janesmith');

INSERT INTO STUDYGROUP (Name, MemberLimit, OwnerUsername)
VALUES ('Cybersecurity Experts', 8, 'emilyb');

INSERT INTO STUDYGROUP (Name, MemberLimit, OwnerUsername)
VALUES ('CPSC 304 Study Buddies', 20, 'johndoe');

INSERT INTO COURSE (Name, CourseNumber, DeptName)
VALUES ('Introduction to differential calculus', 100, 'MATH');

INSERT INTO COURSE (Name, CourseNumber, DeptName)
VALUES ('Intro to Literature', 110, 'ENGL');

INSERT INTO COURSE (Name, CourseNumber, DeptName)
VALUES ('Database Systems', 304, 'CPSC');

INSERT INTO COURSE (Name, CourseNumber, DeptName)
VALUES ('Web Development', 210, 'CPSC');

INSERT INTO COURSE (Name, CourseNumber, DeptName)
VALUES ('Machine Learning', 340, 'CPSC');

INSERT INTO MAJORS (Name, FacultyName)
VALUES ('Computer Science', 'Faculty of Science');

INSERT INTO MAJORS (Name, FacultyName)
VALUES ('Mathematics', 'Faculty of Science');

INSERT INTO MAJORS (Name, FacultyName)
VALUES ('History', 'Faculty of Arts');

INSERT INTO MAJORS (Name, FacultyName)
VALUES ('Economics', 'Faculty of Arts');

INSERT INTO UserGroups (Username, Name)
VALUES ('johndoe', 'CPSC 304 Study Buddies');

INSERT INTO UserGroups (Username, Name)
VALUES ('johndoe', 'Web Development Wizards');

INSERT INTO UserGroups (Username, Name)
VALUES ('janesmith', 'AI and Machine Learning');

INSERT INTO UserGroups (Username, Name)
VALUES ('janesmith', 'Web Development Wizards');

INSERT INTO UserGroups (Username, Name)
VALUES ('alexj', 'Data Science Enthusiasts');

INSERT INTO UserGroups (Username, Name)
VALUES ('emilyb', 'Cybersecurity Experts');

INSERT INTO UserGroups (Username, Name)
VALUES ('emilyb', 'Data Science Enthusiasts');