import React, { Component } from 'react';
import './App.css';
import { relative } from 'path';

//TODO: Brainstorm your vision of the application. Stop jumping from one idea to another!
//TODO: Work on the application design

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      analyzeString: null,
      songName: '',
      fetchedInfo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      APIhits: false,
      token: 'F9Si6uQtnYbJ6qGSVpyB2WYEW2Ppc8-nx18EeYYleeGw-MFw2HqXu8VeAr_hXOYT',
      lexicon: null,
      songDuration: null,
      animationFrame: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.requestSong = this.requestSong.bind(this);
    this.getSong = this.getSong.bind(this);
    this.analyzeEmotion = this.analyzeEmotion.bind(this);
  }

  componentWillMount() {
    const myHeaders = new Headers({
      "Content-Type": "application/json",
      Accept: "application/json"
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

    return value
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
        APIhits: response.response.hits
      }))
  }

  requestSong(songIndex) {
    const songWebPage = "https://genius.com" + this.state.APIhits[songIndex].result.path;
    this.handleAnimationOn(songIndex)
    this.getSong(songWebPage);
    const LastAPI_URL = 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=5bed0a607f046f1ad1870be23ace9cf7&artist=' + encodeURIComponent(this.state.APIhits[songIndex].result.primary_artist.name) + '&track=' + encodeURIComponent(this.state.APIhits[songIndex].result.title)  + '&format=json';
    fetch(LastAPI_URL).then(res => res.json()).then(data => {
      if (data.track.duration) {
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

  handleAnimationOn(index) {
    const animatedFrame = document.getElementsByClassName("itemOnTheList");
    animatedFrame[index].classList.add('loadingAnimation');
    console.dir(animatedFrame[index]);
  }

  handleAnimationOff(index) {
    const animatedFrame = document.getElementsByClassName("itemOnTheList");
    animatedFrame[index].classList.remove('loadingAnimation')
  }

  analyzeEmotion() {
    //TODO: Get the result with the stop words, work on the end algorithm
    let stopWords = [ "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "aren’t", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "couldn't", "couldn’t", "did", "didn't","didn’t", "do", "don't", "don’t", "does", "doesn't", "doesn’t", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "hadn’t", "has", "hasn't", "hasn’t", "have", "haven't", "haven’t", "having", "he", "he'd", "he’d", "he'll", "he’ll", "he's", "he’s", "her", "here", "here's", "here’s", "hers", "herself", "him", "himself", "his", "how", "how's", "how’s", "i", "i'd", "i’d", "i'll", "i’ll", "i'm", "i’m", "i've", "i’ve", "if", "in", "into", "is", "isn't", "isn’t", "it", "it's", "it’s", "its", "itself", "let's", "let’s", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she’d", "she'll", "she’ll", "she's", "she’s", "should", "shoudn't", "shoudn’t", "so", "some", "such", "than", "that", "that's", "that’s", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "there’s", "these", "they", "they'd", "they’d", "they'll", "they’ll", "they're", "they’re", "they've", "they’ve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we’d", "we'll", "we’ll", "we're", "we’re", "we've", "we’ve", "were", "what", "what's", "what’s", "when", "when's", "when’s", "where", "where's", "where’s", "which", "while", "who", "who's", "who’s", "whom", "why", "why's", "why’s", "with", "would", "wouldn't", "wouldn’t", "you", "you'd", "you’d", "you'll", "you’ll", "you're", "you’re", "you've", "you’ve", "your", "yours", "yourself", "yourselves", "not", "no" ];
    var getLyrDensity = () => {
      let arrOfWords = this.state.analyzeString.toLowerCase().split(/\s+/).slice(1).filter(word => {
        return stopWords.some(stopper => stopper === word) ? false : true;
      });
      console.log(arrOfWords);
      let totalWords = arrOfWords.length; 
      let wordHits = 0;
      for (let i = 0; i <= totalWords - 1; i++) {
        let currWord = arrOfWords[i];
        if (currWord[currWord.length - 1] === "s") {
          currWord = currWord.slice(0, -1);
          if (this.state.lexicon.sadness.some(element => element === currWord)) {
            wordHits++;
            continue;
          }
        }
        if (currWord.slice(-2) === "ed") {
          currWord = currWord.slice(0, -1); //for word w/o "d"
          if (this.state.lexicon.sadness.some(element => element === currWord)) {
            wordHits++;
            continue;
          }
          currWord = currWord.slice(0, -1); //for word w/o "ed"
          if (this.state.lexicon.sadness.some(element => element === currWord)) {
            wordHits++;
            continue;
          }
        }
        if (this.state.lexicon.sadness.some(element => element === currWord)) {
          wordHits++;
        }
      }
      console.log("Word hits " + wordHits);
      if (wordHits > 0) {
        let percentSad = wordHits / totalWords * 100;
        console.log(Math.ceil(percentSad));
      }
    }
    getLyrDensity();
  }

  render() {
    
    let textbox;

    if (!this.state.APIhits) {
      if (typeof this.state.fetchedInfo !== 'object') {
        textbox = this.state.fetchedInfo;
      } else {
        //TODO: How to handle long statments in the lyrics? e.g. AJJ/The Beatles
        textbox = <div>
          <button style = {{display: 'block', margin: '0 auto'}} onClick = {() => {this.analyzeEmotion()}} className = "btn btn-primary">Analyze the Sadness</button>
          <br />
          {this.state.fetchedInfo.map((hit) => {
            return hit.map((elem, index) => {
              return <span key = {index} style = {{display: 'flex', justifyContent: 'center'}}>{elem}<br /></span>
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
      <button onClick = {this.handleClick} className = "btn btn-warning">
        Fetch
      </button>
      <p /><h4 className = "lyrHolder">{textbox}</h4>
     </div>
    );
  }
}

export default App;