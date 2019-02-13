import React, { Component } from 'react';
import './App.css';
import { relative } from 'path';

//TODO: ResetButton on list of emotions page
//TODO: consider adding the weight of the lyrics for song (based on the this.state.songDuration)
//TODO: The title of the song on emotions page
//TODO: create switch on the frontpage to select all emotions + buttons?
//TODO: create a graph based on selected emotions and switch between graph and table view

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analyzeString: null,
      songName: '',
      fetchedInfo: "default value",
      APIhits: false,
      token: 'F9Si6uQtnYbJ6qGSVpyB2WYEW2Ppc8-nx18EeYYleeGw-MFw2HqXu8VeAr_hXOYT',
      lexicon: null,
      songDuration: null, //do I actually need it?
      animationFrame: false,
      shower: {display: "block"},
      songAnalysis: {},
      selectedEmotions: {
        sadness :false,
        anger: false,
        fear: false,
        joy: false
      }
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.requestSong = this.requestSong.bind(this);
    this.getSong = this.getSong.bind(this);
    this.analyzeEmotion = this.analyzeEmotion.bind(this);
    this.shortenSong = this.shortenSong.bind(this);
    this.toggleEmotion = this.toggleEmotion.bind(this);
    this.checkDB = this.checkDB.bind(this);
  }

  componentWillMount() {
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      "Accept": "application/json"
    });
    
    fetch('/api/getLexicon', {headers: myHeaders}).then(res => {
      return res.json();
    }).then(lexin => {
      this.setState({
        lexicon: lexin
      })
    })
  }

  callServer = async(URL) => {
    const response = await fetch('api/getSong', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({LyrURL: URL})
    });
    const value = await response.json();

    if (response.status !== 200) console.log(value.message);

    return value;  
  }

  //For this.calculateWeight()
  checkDB = async(emotion, song, score) => {
    const response = await fetch('api/CheckDB', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({emo: emotion, title: song, percent: score})
    });
    const returned = await response.json();
    if (response.status !== 200) console.log("Coulnd recive the data");
    
    return returned;
  }

  handleChange(event) {
    this.setState({
      songName: event.target.value
    });
  }

  handleClick() {

    var url = 'https://api.genius.com/search?q=' + encodeURIComponent(this.state.songName) + '&access_token=' + this.state.token;

    fetch(url).then(res => res.json()).then(response => 
      this.setState({
        shower: {display: "block"},
        APIhits: response.response.hits
      }));
      //TODO: Change sequence?
      document.getElementsByClassName("emotionTable")[0].innerHTML = "";
  }

  requestSong(songIndex) {
    const songWebPage = "https://genius.com" + this.state.APIhits[songIndex].result.path;
    this.handleAnimationOn(songIndex)
    this.getSong(songWebPage);
    //TODO: possibly remove next to commands
    const LastAPI_URL = 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=5bed0a607f046f1ad1870be23ace9cf7&artist=' + encodeURIComponent(this.state.APIhits[songIndex].result.primary_artist.name) + '&track=' + encodeURIComponent(this.state.APIhits[songIndex].result.title)  + '&format=json';
    fetch(LastAPI_URL).then(res => res.json()).then(data => {
      if (data.hasOwnProperty('track')) {
        this.setState({
          songDuration: Number(data.track.duration) / 1000
        })
      } else {
        this.setState({
          songDuration: 225
        })
      }
    })
    this.handleAnimationOff(songIndex);
  }

  getSong(URL) {
    this.callServer(URL).then(res => {
      var songPretified = res.lyrics
      function arrayer(song, symbol) {
        let arrayOfParts = [];
        let startIndex = 1;
        let endIndex = 0;
        while (song) {
          endIndex = song.indexOf(symbol, startIndex);
          if (endIndex === -1) {
            arrayOfParts.push(song.slice(startIndex - 1, song.length));
            break;
          }
          arrayOfParts.push(song.slice(startIndex - 1, endIndex));
          startIndex = endIndex + 1; 
        }
        return arrayOfParts;
      }

      var pageBreakArr = arrayer(songPretified, "[");
      for (let i = 0; i <= pageBreakArr.length - 1; i++) {
        pageBreakArr[i] = arrayer(pageBreakArr[i], String.fromCharCode(10));
        if (i !== pageBreakArr.length - 1) pageBreakArr[i].pop();
      }

      this.setState({
        analyzeString: songPretified.replace(/\[.+\]/g, "").replace(/[^\w\s'’]|_/g, ""),
        fetchedInfo: pageBreakArr, 
        APIhits: false,
      })
    });
  }
  
  //Also, at the moment this part of code is not working (Code Works ahaed - yeah i sure hope it does)
  //TODO: Learn animation in react
  handleAnimationOn(index) {
   //TODO: test adding text instead of animation on the same classes
    const animatedFrame = document.getElementsByClassName("itemOnTheList");
    animatedFrame[index].classList.add('loadingAnimation');
    console.dir(animatedFrame[index]);
    this.setState({
      animationFrame: true
    })
  }

  handleAnimationOff(index) {
    const animatedFrame = document.getElementsByClassName("itemOnTheList");
    animatedFrame[index].classList.remove('loadingAnimation');
    this.setState({
      animationFrame: false
    })
  }

  shortenSong() {
    let stopWords = [ "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "aren’t", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "couldn't", "couldn’t", "did", "didn't","didn’t", "do", "don't", "don’t", "does", "doesn't", "doesn’t", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "hadn’t", "has", "hasn't", "hasn’t", "have", "haven't", "haven’t", "having", "he", "he'd", "he’d", "he'll", "he’ll", "he's", "he’s", "her", "here", "here's", "here’s", "hers", "herself", "him", "himself", "his", "how", "how's", "how’s", "i", "i'd", "i’d", "i'll", "i’ll", "i'm", "i’m", "i've", "i’ve", "if", "in", "into", "is", "isn't", "isn’t", "it", "it's", "it’s", "its", "itself", "let's", "let’s", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she’d", "she'll", "she’ll", "she's", "she’s", "should", "shoudn't", "shoudn’t", "so", "some", "such", "than", "that", "that's", "that’s", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "there’s", "these", "they", "they'd", "they’d", "they'll", "they’ll", "they're", "they’re", "they've", "they’ve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we’d", "we'll", "we’ll", "we're", "we’re", "we've", "we’ve", "were", "what", "what's", "what’s", "when", "when's", "when’s", "where", "where's", "where’s", "which", "while", "who", "who's", "who’s", "whom", "why", "why's", "why’s", "with", "would", "wouldn't", "wouldn’t", "you", "you'd", "you’d", "you'll", "you’ll", "you're", "you’re", "you've", "you’ve", "your", "yours", "yourself", "yourselves", "not", "no" ];
    let arrOfWords = this.state.analyzeString.toLowerCase().split(/\s+/).slice(1).filter(word => {
      return stopWords.some(stopper => stopper === word) ? false : true;
    });
    return arrOfWords;
  }

  analyzeEmotion() {
    //TODO: Find unicode range for english letters
    let arrOfWords = this.shortenSong();

    //function to find actual percent based on the corelation between wordhits and the total amount of non-stop words in the song
    var getLyrDensity = (emotion) => {
      let totalWords = arrOfWords.length; 
      let wordHits = 0;
      for (let i = 0; i <= totalWords - 1; i++) {
        let currWord = arrOfWords[i];
        if (currWord[currWord.length - 1] === "s") {
          if (this.state.lexicon[emotion].some(element => element === currWord.slice(0, -1))) {
            wordHits++;
            continue;
          }
        }
        if (currWord.slice(-2) === "ed") {
          if (this.state.lexicon[emotion].some(element => element === currWord.slice(0, -1))) {
            wordHits++;
            continue;
          }
          if (this.state.lexicon[emotion].some(element => element === currWord.slice(0, -2))) {
            wordHits++;
            continue;
          }
        }
        if (this.state.lexicon[emotion].some(element => element === currWord)) {
          wordHits++;
        }
      }
      let percentEmo;
      if (wordHits > 0) {
        percentEmo = Math.ceil(wordHits / totalWords * 100);
      } else {
        percentEmo = 0;
      }
      let obj = this.state.songAnalysis
      obj[emotion] = percentEmo;
      this.setState({
        songAnalysis: obj,
      })
    }

    var calculateWieght = (emotion, total) => {
      if (emotion === 0 || total === 0) {
        return 0;
      } else {
        return Math.round(emotion / total * 100);
      }
    }

    let analyzedEmotions = [];
    for (let key in this.state.selectedEmotions) {
      if (this.state.selectedEmotions[key]) analyzedEmotions.push(key);
    }

    for (let i = 0; i <= analyzedEmotions.length - 1; i++) {
      getLyrDensity(analyzedEmotions[i]);
    }

    let obj = this.state.selectedEmotions;
    
    let firstTrue = (function() {
      console.log(obj);
      return Object.keys(obj).find(key => obj[key] === true);
    })();

    let overall = analyzedEmotions.reduce((prev, curr) => {
      if (prev === firstTrue) return this.state.songAnalysis[prev] + this.state.songAnalysis[curr];
      return prev + this.state.songAnalysis[curr];
    })

    //TODO handle single emotion && more then 3
    let html = "<div class = 'container'><div class = 'row' id = 'emotionContainer'>";
    if (analyzedEmotions.length !== 1) {
      for (let i = 0; i <= analyzedEmotions.length - 1; i++) {
        html += "<div class = 'col-3' id = '" + analyzedEmotions[i] + "Table'>" + analyzedEmotions[i] + ":<br/>" + calculateWieght(this.state.songAnalysis[analyzedEmotions[i]], overall) + "%</div>"
        if ((i + 1) % 3 === 0) {
          html += "</div><div class = 'row' id = 'emotionContainer'>";
        }
      }
      html += "</div></div>";
      document.getElementsByClassName("emotionTable")[0].innerHTML = html;
    } else {
      //TODO: Make the dissapearens of element and appearance of emoTable simultaneous
      //TODO: fix bug with multiple requests for single
      let emotion = analyzedEmotions[0];
      let song = "placholder";
      let score = this.state.songAnalysis[analyzedEmotions[0]];
      this.checkDB(emotion, song, score).then(res => {
        html += "<div class = 'col-3' id = '" + emotion + "Table'>" + emotion + ":<br/>" + res.score + "%</div>"
        html += "</div></div>"
        document.getElementsByClassName("emotionTable")[0].innerHTML = html
      });
      this.setState({
        shower: {display: "none"}
      })
    }

  }

  //TODO: handle Single emotion selected by implementing DB
  toggleEmotion(event, emo) {
    if (this.state.selectedEmotions[emo]) {
        let obj = this.state.selectedEmotions;
        obj[emo] = false;
        this.setState({
          selectedEmotions: obj
      })
      } else {
        let obj = this.state.selectedEmotions;
        obj[emo] = true;
        this.setState({
          selectedEmotions: obj
        });
      }
    }

  render() {
    
    let textbox;
    
    if (!this.state.APIhits) {
      if (typeof this.state.fetchedInfo !== 'object') {
        textbox = <div>
          {Object.keys(this.state.selectedEmotions).map((key, index) => {
            let elemText = key.charAt(0).toUpperCase() + key.slice(1) + ": ";
            return <div id = 'wrapper'><div className = 'mainPageHolder'>{elemText}</div><div className = 'mainPageHolder'><span className = 'emotionSwitch' key = {index}><label className = 'switch'><input type = 'checkbox' onClick = {(e) => {this.toggleEmotion(e, key)}}/><span className = 'slider'></span></label><br/></span></div></div>
          })}
        </div>;
      } else {
        textbox = <div>
          <button style = {{display: 'block', margin: '0 auto'}} onClick = {() => {this.analyzeEmotion()}} className = "btn btn-primary">Analyze the Sadness</button>
          <br />
            {this.state.fetchedInfo.map((hit) => {
              return hit.map((elem, index) => {
                return <span key = {index} style = {{display: 'block', margin: '0 auto', textAlign: "center"}}>{elem}<br /></span>
              })
            })
          }
        </div>
      }      
    } else {
      textbox = this.state.APIhits.map((hit, index) => {
        return <div className = "container itemOnTheList" key = {index} onClick = {() => {this.requestSong(index)}}>
            <div className = "row">
              <div className = "col-4" id = "pictureHolder" >
                <img src = {hit.result.song_art_image_thumbnail_url} style = {{height: "100px", width: relative}} alt = "oopsie happend!" id = "songThumbnail"/>
              </div>
              <div className = "col-8" id = "nameGroupBox">
                <h3 id = "songTitle">{hit.result.title}</h3>
                <h5 id = "songArtist"><i>by {hit.result.primary_artist.name}</i></h5>
              </div>
            </div>
          </div>
      });
    } 

    return (
     <div className = "App">
     <div className = "header"><h1> SADLYRICSBOT </h1></div>
      <input  placeholder="Name of the song" onChange = {this.handleChange} style = {{margin: '10px'}} />
      <button 
        onClick = {() => {Object.values(this.state.selectedEmotions).indexOf(true) > -1 ?
         this.handleClick() : 
         alert("Please select at least one emotion")}} 
        className = "btn btn-warning">
        Fetch
      </button>
      <div className = "emotionTable"></div>
      <p /><h4 className = "lyrHolder" style = {this.state.shower}>{textbox}</h4>
     </div>
    );
  }
}

export default App;
