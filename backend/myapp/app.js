const express = require('express')
const app = express()
const bodyParser = require('body-parser'); // Needed for parsing JSON body
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const server = require('http').createServer(app); // Required for socket.io
var db = require("./database.js")
const port = 8000
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('joinGroup', (groupName) => {
        socket.join(groupName);
        console.log(`Socket ${socket.id} joined room ${groupName}`);
    });



    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
    socket.on('groupMessage', ({ groupName, sender, message, html }) => {
        const sql = `INSERT INTO Messages (GroupName, Sender, Message, Html) VALUES (?, ?, ?, ?)`;
        db.run(sql, [groupName, sender, message, html], (err) => {
            if (err) {
                console.error("Failed to save message:", err.message);
            } else {
                console.log(`💬 Message from ${sender} saved in ${groupName}`);
            }
        });

        socket.to(groupName).emit('groupMessage', { sender, message, html });
    });

});



app.get('/api/messages', (req, res) => {
    const groupName = req.query.group;
    if (!groupName) return res.status(400).json({ error: "Group name is required" });

    const sql = `SELECT Sender, Message, Html, Timestamp FROM Messages WHERE GroupName = ? ORDER BY Timestamp ASC`;
    db.all(sql, [groupName], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ messages: rows });
    });
});


app.get('/', (req, res) => {
    res.send('Hello from Express and Socket.IO server');
});

// app.get('/', (req, res) => {
//     res.send('Hello World!')
// })

app.get("/api/users", (req, res, next) => {
    var sql = "SELECT * FROM USERS"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.get("/api/groups", (req, res, next) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ "error": "Username is required" });
    }
    var sql = "SELECT * FROM UserGroups WHERE Username = ?"
    var params = [username]
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.get("/api/courses", (req, res, next) => {
    var sql = "SELECT * FROM COURSE"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.get("/api/majors", (req, res, next) => {
    var sql = "SELECT * FROM MAJORS"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
});

app.post("/api/groups", (req, res) => {
    const { name, owner, memberLimit } = req.body;

    if (!name || !owner || !memberLimit) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const sql = `INSERT INTO STUDYGROUP (Name, OwnerUsername, MemberLimit) VALUES (?, ?, ?)`;
    const params = [name, owner, memberLimit];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const sql2 = `INSERT INTO UserGroups (Username, Name) VALUES (?, ?)`;
        const params2 = [owner, name];

        db.run(sql2, params2, function (err2) {
            if (err2) {
                return res.status(500).json({ error: err2.message });
            }

            // Only send the response once, when all DB inserts succeed
            res.status(201).json({
                message: "Group created successfully and owner added to group",
                group: {
                    id: this.lastID,
                    name,
                    owner,
                    memberLimit
                }
            });
        });
    });
});


app.post("/api/register", async (req, res) => {
    const { firstname, lastname, username, password, email } = req.body;

    if (!firstname || !lastname || !username || !password || !email) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Check if username already exists
        db.get("SELECT * FROM USERS WHERE Username = ?", [username], (err, row) => { // can't use async in callback function
            if (err) {
                return res.status(500).json({ error: "Database error" });
            }
            if (row) {
                return res.status(400).json({ error: "Duplicate username" });
            }

            // Hash the password
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ error: "Error hashing password" });
                }

                console.log("Hashed Password:", hashedPassword);

                // Insert user into database
                const sql = "INSERT INTO USERS (FirstName, LastName, Username, Password, Email) VALUES (?, ?, ?, ?, ?)";
                const params = [firstname, lastname, username, hashedPassword, email];

                db.run(sql, params, function (err) {
                    if (err) {
                        console.error(" Error inserting into database:", err.message);
                        return res.status(500).json({ error: err.message });
                    }
                    res.status(201).json({
                        message: "User created successfully",
                        user: {
                            firstname,
                            lastname,
                            username,
                            email
                        }
                    });
                });
            });
        });
    } catch (error) {
        console.error(" Internal Server Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.patch("/api/groups/:name", (req, res) => {
    const groupName = req.params.name;
    const { newName, owner, memberLimit } = req.body;

    db.get("SELECT * FROM STUDYGROUP WHERE Name = ?", [groupName], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: "Group not found" });
        }

        const updatedName = newName || row.Name;
        const updatedOwner = owner || row.OwnerUsername;
        const updatedMemberLimit = memberLimit || row.MemberLimit;

        if (updatedName === row.Name && updatedOwner === row.OwnerUsername && updatedMemberLimit === row.MemberLimit) {
            return res.status(200).json({
                message: "No changes made",
                group: {
                    name: updatedName,
                    owner: updatedOwner,
                    memberLimit: updatedMemberLimit
                },
                changes: 0
            });
        }

        const sql = `UPDATE STUDYGROUP SET Name = ?, OwnerUsername = ?, MemberLimit = ? WHERE Name = ?`;
        const params = [updatedName, updatedOwner, updatedMemberLimit, groupName];

        db.run(sql, params, function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(200).json({
                message: "Group updated successfully",
                group: {
                    name: updatedName,
                    owner: updatedOwner,
                    memberLimit: updatedMemberLimit
                },
                changes: this.changes
            });
        });
    });
});

app.patch("/api/users/:username", (req, res) => {
    const userName = req.params.username;
    const { newFirstName, newLastName, newPassword, newEmail } = req.body;

    db.get("SELECT * FROM USERS WHERE Username = ?", [userName], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: "User not found" });
        }

        const updatedFirstName = newFirstName || row.FirstName;
        const updatedLastName = newLastName || row.LastName;
        const updatedPassword = newPassword || row.Password;
        const updatedEmail = newEmail || row.Email;

        if (updatedFirstName === row.FirstName && updatedLastName === row.LastName && updatedPassword === row.Password && updatedEmail === row.Email) {
            return res.status(200).json({
                message: "No changes made",
                users: {
                    FirstName: updatedFirstName,
                    LastName: updatedLastName,
                    Password: updatedPassword,
                    Email: updatedEmail
                },
                changes: 0
            });
        }

        const sql = `UPDATE USERS SET FirstName = ?, LastName = ?, Password = ?, Email = ? WHERE Username = ?`;
        const params = [updatedFirstName, updatedLastName, updatedPassword, updatedEmail, userName];

        db.run(sql, params, function (err) {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            res.status(200).json({
                message: "User updated successfully",
                users: {
                    FirstName: updatedFirstName,
                    LastName: updatedLastName,
                    Password: updatedPassword,
                    Email: updatedEmail
                },
                changes: this.changes
            });
        });
    });
});

app.delete("/api/groups/:name", (req, res) => {
    const groupName = req.params.name;
    console.log(`Received DELETE request for group: ${groupName}`);
    // Run the DELETE query on the STUDYGROUP table
    db.run(
        'DELETE FROM STUDYGROUP WHERE Name = ?',
        [groupName],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });  // Server error
                return;
            }

            if (this.changes === 0) {
                // No group was deleted (group with this Name doesn't exist)
                res.status(404).json({ message: `Group with Name '${groupName}' not found.` });
                return;
            }

            // Group was successfully deleted
            res.status(200).json({ message: `Group with Name '${groupName}' deleted successfully.` });
        }
    );
});

const SECRET_KEY = "mysecretkey";

// Login Endpoint (POST /login)
app.post("/login", (req, res) => {
    console.log("Incoming Login Request:", req.body);
    const { username, password } = req.body;

    if (!username || !password) {
        console.error("Missing username or password");
        return res.status(400).json({ error: "Username and password are required" });
    }

    db.get("SELECT * FROM USERS WHERE Username = ?", [username], (err, user) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (!user) {
            console.error("User not found");
            return res.status(401).json({ error: "Invalid username or password" });
        }

        console.log("Stored Password:", user.Password);
        console.log("Entered Password:", password);

        // Compare hashed password with entered password
        bcrypt.compare(password, user.Password, (err, isMatch) => {
            if (err) {
                console.error(" Error verifying password:", err);
                return res.status(500).json({ error: "Error verifying password" });
            }
            if (!isMatch) {
                console.error(" Password does not match");
                return res.status(401).json({ error: "Invalid username or password" });
            }

            // Generate JWT Token
            jwt.sign({ id: user.Username, email: user.Email }, SECRET_KEY, { expiresIn: "1h" }, (err, token) => {
                if (err) {
                    return res.status(500).json({ error: "Failed to generate token" });
                }
                console.log("Login Successful. Returning:", { token, username: user.Username });
                res.json({ token, username: user.Username });
            });
        });
    });
});

// Protected Route Example (Requires Token)
app.get("/protected", verifyToken, (req, res) => {
    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
        if (err) {
            return res.sendStatus(403);
        } else {
            res.json({
                message: "This is a protected route",
                authData
            });
        }
    });
});

app.get("/api/profile", verifyToken, (req, res) => {
    res.json({
        message: "Welcome to your profile",
        user: req.user  // This contains decoded JWT user data
    });
});

// Token Verification Middleware
function verifyToken(req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Store decoded user details in req.user
        next(); // Proceed to the next middleware/route
    } catch (error) {
        return res.status(401).json({ error: "Access denied. Invalid token." });
    }
}
module.exports = verifyToken;

// Add User to Group
app.post("/groups/:name/users", (req, res) => {
    const { name } = req.params;
    const { username } = req.body;

    console.log("🟢 Received request for group:", name);
    console.log("📦 Received username:", username);

    if (!username) {
        console.error(" Error: Username is missing");
        return res.status(400).json({ error: "Username is missing" });
    }

    //  Step 1: Check if the group exists in the StudyGroup table
    db.get("SELECT * FROM StudyGroup WHERE Name = ?", [name], (err, groupRow) => {
        if (err) {
            console.error(" Database error (CHECK GROUP EXISTS):", err.message);
            return res.status(500).json({ error: "Database error" });
        }
        if (!groupRow) {
            console.error(" Error: Group does not exist");
            return res.status(404).json({ error: "Group does not exist" });
        }

        //  Step 2: Check if the user is already in the group
        db.get("SELECT * FROM UserGroups WHERE Username = ? AND Name = ?", [username, name], (err, row) => {
            if (err) {
                console.error(" Database error (CHECK USER EXISTS):", err.message);
                return res.status(500).json({ error: "Database error" });
            }
            if (row) {
                console.log(" User already in the group");
                return res.status(200).json({ message: "User is already in the group" });
            }


            db.run("INSERT INTO UserGroups (Username, Name) VALUES (?, ?)", [username, name], (err) => {
                if (err) {
                    console.error(" Database error (INSERT USER):", err.message);
                    return res.status(500).json({ error: "Error when adding user to group" });
                }
                console.log("User added successfully to group:", name);
                res.status(201).json({ message: "User added to group successfully" });
            });
        });
    });
});



server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
