const express = require('express')
const app = express()
var db = require("./database/database.js")
const port = 8000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get("/api/users", (req, res, next) => {
    var sql = "SELECT * FROM user"
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


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})