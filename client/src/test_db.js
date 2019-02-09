var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Paradisecity99",
    database: "sadlyrbot"
});

con.connect(function(err) {
    if (err) {
        throw err;
    }
    console.log("Connected!");
    //var sql = "CREATE TABLE maxEmotion (id INT AUTO_INCREMENT PRIMARY KEY, emotion VARCHAR(255), song VARCHAR(255), percent INT)"
    var sql = "INSERT INTO maxEmotion (emotion, song, percent) VALUES ('fear', 'none', '0')";
    con.query(sql, (err, result) => {
        if (err) throw err;
        console.log("fear added");
    })
})