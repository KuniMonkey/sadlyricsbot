const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const cherrio = require('cheerio');
const data = require('./client/src/lexicon.json')

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/getSong', (req, res) => {
    request(req.body.LyrURL, (error, response, html) => {
        if (!error && response.statusCode == 200) {
            const $ = cherrio.load(html);
            const song = $('.lyrics p').text();
            res.send({lyrics: song});
        }
    })
});

app.get('/api/getLexicon', (req, res) => {
    res.send(data);
})

app.listen(port, () => console.log(`Listening on port ${port}`));