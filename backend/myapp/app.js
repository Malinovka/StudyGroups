const express = require('express')
const app = express()
const bodyParser = require('body-parser'); // Needed for parsing JSON body
const bcrypt = require('bcryptjs');

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
app.post("/api/register",(req, res)=>{
    const {firstname, lastname,username, password, email} = req.body;
    if (!firstname || !lastname || !username || !password || !email){
        return res.status(400).json({error : "Missing Required fields" });
    }
    let hashedPassword = "";

// Encryption of the string password
    bcrypt.genSalt(10, function (err, Salt) {

        // The bcrypt is used for encrypting password.
        bcrypt.hash(password, Salt, function (err, hash) {

            if (err) {
                return console.log('Cannot encrypt');
            }

            hashedPassword = hash;
            console.log(hash);

            bcrypt.compare(password, hashedPassword,
                async function (err, isMatch) {

                    // Comparing the original password to
                    // encrypted password
                    if (isMatch) {
                        console.log('Encrypted password is: ', password);
                        console.log('Decrypted password is: ', hashedPassword);
                    }

                    if (!isMatch) {

                        // If password doesn't match the following
                        // message will be sent
                        console.log(hashedPassword + ' is not encryption of '
                            + password);
                    }
                })
        })
    })
    var check = 'SELECT * FROM USERS WHERE Username = ?'
    db.get(check, [username], (err,row) =>{
        if (row){
            res.status(400).json({error:"Duplicate Username"});
        }
    })
    var sql = 'INSERT INTO USERS (FirstName, LastName, Username, Password, Email) VALUES (?,?,?,?,?)';
    var params = [firstname,lastname, username, hashedPassword,email];
    db.run(sql, params, function (err) {
        if (err){
            res.status(500).json({error: err.message});
        }
        res.status(201).json({
            message:"User created successfully",
            user: {
                firstname,
                lastname,
                username,
                email
            }
        })
    })

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});