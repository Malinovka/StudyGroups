const express = require('express')
const app = express()
const bodyParser = require('body-parser'); // Needed for parsing JSON body

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