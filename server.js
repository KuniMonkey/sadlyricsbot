const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const cherrio = require('cheerio');
const data = require('./client/src/lexicon.json');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 5000;
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Paradisecity99",
    database: "sadlyrbot"
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/:action', (req, res) => {
    if (req.params.action === 'getSong') {
        request(req.body.LyrURL, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cherrio.load(html);
                const song = $('.lyrics p').text();
                res.send({lyrics: song});
            }
        })
    }
    if (req.params.action === 'CheckDB') {
        console.log("before connect");
        con.connect(function(err) {
        console.log("after connect");
        if (err) console.log(err);
        const sql = "SELECT percent FROM maxemotion WHERE emotion='" + req.body.emo + "'";
        console.log(sql);
        con.query(sql, (err, result) => {

            if (err) console.log(err);
    
            if (req.body.percent > result[0].percent) {
                //add posting to Data Base
                let upQuery = "UPDATE maxemotion SET percent = '" + req.body.percent + "'WHERE emotion = '" + req.body.emo + "'" ;
                con.query(upQuery, (err, result) => {
                    if (err) console.log(err);
                })
                res.send({score: "100"})
            } else {
                let emoScore = (req.body.percent / result[0].percent) * 100;
                res.send({score: emoScore});
                }
            });
        });
    }
});

app.get('/api/getLexicon', (req, res) => {
    res.send(data);
})

app.listen(port, () => console.log(`Listening on port ${port}`));
