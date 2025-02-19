const express = require('express')
const app = express()
const bodyParser = require('body-parser'); // Needed for parsing JSON body
const jwt = require("jsonwebtoken");

var db = require("./database.js")
const port = 8000
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

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
    var sql = "SELECT * FROM STUDYGROUP"
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

    var sql = `INSERT INTO STUDYGROUP (Name, OwnerUsername, MemberLimit) VALUES (?, ?, ?)`;
    var params = [name, owner, memberLimit];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: "Group created successfully",
            group: {
                id: this.lastID,  // Return newly created ID
                name,
                owner,
                memberLimit
            }
        });
    });
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
    const { username, password } = req.body;

    // Check if both fields are provided
    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    // Query user from database
    db.get("SELECT * FROM USERS WHERE Username = ?", [username], (err, user) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Verify password (In a real app, use hashed passwords with bcrypt)
        if (user.Password !== password) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Generate JWT Token
        jwt.sign({ id: user.Username, email: user.Email }, SECRET_KEY, { expiresIn: "1h" }, (err, token) => {
            if (err) {
                return res.status(500).json({ error: "Failed to generate token" });
            }
            res.json({ token });
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

// Token Verification Middleware
function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});