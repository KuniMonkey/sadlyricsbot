import React, { Component } from 'react';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songName: '',
      fetchedInfo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      APIhits: false,
      token: 'F9Si6uQtnYbJ6qGSVpyB2WYEW2Ppc8-nx18EeYYleeGw-MFw2HqXu8VeAr_hXOYT'
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.requestSong = this.requestSong.bind(this);
    this.getSong = this.getSong.bind(this);
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

  getSong(URL) {
    this.callServer(URL).then(res => {
      var songPretified = res.lyrics

      //TODO: Make function arrayer abstract: take search symbol as a parameter (maybe move it to the body of the component dunno)
      function arrayer(song) {
        let arrayOfParts = [];
        let startIndex = 1;
        let endIndex = 0;
        while (song) {
          endIndex = song.indexOf("[", startIndex);
          if (endIndex === -1) {
            arrayOfParts.push(song.slice(startIndex - 1, song.length - 1));
            break;
          }
          arrayOfParts.push(song.slice(startIndex - 1, endIndex - 1));
          startIndex = endIndex + 1; 
        }
        console.log(arrayOfParts[0].charCodeAt(10)); //87
        return arrayOfParts;
      }

      console.log(arrayer(songPretified))

      this.setState({
        fetchedInfo: songPretified, //.replace(/\[.+\]/g, ""),
        APIhits: false
      })
    });
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
    var songWebPage = "https://genius.com" + this.state.APIhits[songIndex].result.path;
    this.getSong(songWebPage);    
  }

  render() {
    
    let textbox;

    if (!this.state.APIhits) {
      textbox = this.state.fetchedInfo;
    } else {
      textbox = this.state.APIhits.map((hit, index) => {
        return <li key = {index} onClick = {() => {this.requestSong(index)}}>{hit.result.full_title}</li>
      }) 
    }

    return (
     <div className = "App">
      <input  placeholder="Name of the song" 
        value = "Radiohead" onChange = {this.handleChange}/>
      <button onClick = {this.handleClick}>
        Fetch
      </button>
      <p /><h2>test: {this.state.songName}</h2> 
      <p /><h4 className = "lyrHolder">{textbox}</h4>
     </div>
    );
  }
}

export default App;
