const fs = require('fs');
var text;

text = fs.readFileSync('NRC-Emotion-Lexicon-Wordlevel-v0.92.txt', "utf8");

text = text.replace(/\t/g, " ").split("\r\n");

const lexiconObj = {
    'anger': [],
    'anticipation': [],
    'disgust': [],
    'fear': [],
    'joy': [],
    'negative': [],
    'positive': [],
    'sadness': [],
    'surprise': [],
    'trust': []
}

for (let i = 0; i <= text.length - 2; i++) {
    let word = text[i].split(" ");
    if (word[2] == '0') {
        continue;
    } else {
        lexiconObj[word[1]].push(word[0]);
    }
}

fs.writeFile('lexicon.json', JSON.stringify(lexiconObj), function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Done!");
    }
})