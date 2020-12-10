// Parsing relevant movie data
// DO NOT run this file, will overwrite any existing parsed data for movies

let movieData = require("./data/movie-data.json");
let actorData = require("./sample-actors.json")
let directorData = require("./sample-directors.json")
let writerData = require("./sample-writers.json")
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');

let actors = [];
let works = [];
movieData.forEach(a=>{
  const getName = a.Actors.split(",");
  let getWorks = "http://127.0.0.1:3000/displayMovieInfo/";

  //const displayName = getName[0] + " " + getName[1] + " " + getName[2];

  if (a.Actors.includes(getName)){
    let getWorks = "http://127.0.0.1:3000/displayMovieInfo/" + a.imdbID;
    works.push(getWorks)
  }
  
  actors.push(getName);
 // works.push(getWorks)
})

let directors = [];
let dWorks = [];
movieData.forEach(a=>{
  const getName = a.Director.split(",");
  let getWorks = "http://127.0.0.1:3000/displayMovieInfo/";

  //const displayName = getName[0] + " " + getName[1] + " " + getName[2];

  if (a.Director.includes(getName)){
    let getWorks = "http://127.0.0.1:3000/displayMovieInfo/" + a.imdbID;
    dWorks.push(getWorks)
  }
  
  directors.push(getName);
 // works.push(getWorks)
})

let writers = [];
let wWorks = [];
movieData.forEach(a=>{
  const getName = a.Writer.split(",");
  let getWorks = "http://127.0.0.1:3000/displayMovieInfo/";

  // const displayName = getName[0] + " " + getName[1] // + " " + getName[2];

  if (a.Writer.includes(getName)){
    let getWorks = "http://127.0.0.1:3000/displayMovieInfo/" + a.imdbID;
    wWorks.push(getWorks)
  }
  
  writers.push(getName);
 // works.push(getWorks)
})

let genre = [];
let gWorks = [];
movieData.forEach(a=>{
  const getName = a.Genre.split(",");
  let getWorks = "http://127.0.0.1:3000/displayMovieInfo/";

  // const displayName = getName[0] + " " + getName[1] // + " " + getName[2];

  if (a.Genre.includes(getName)){
    let getWorks = "http://127.0.0.1:3000/displayMovieInfo/" + a.imdbID;
    wWorks.push(getWorks)
  }
  
  genre.push(getName);
 // works.push(getWorks)
})

let sampleMovies = {};
let movieIDList = [];
let movieID = uuidv4();
// let newActorData = require("./actors.json");

for (let i = 0; i < movieData.length; i++){
  let m = {};
  m.id = movieID;
  m.title = movieData[i].Title;
  m.year = movieData[i].Year;
  m.similarMovies = [];
  m.movieLink = [];
  m.basicReviews = [];
  m.fullReviews = [[], [], []];
  m.runtime = movieData[i].Runtime;
  m.plot = movieData[i].Plot;
  m.poster = movieData[i].Poster;
  m.genre = [];

  for (let j = 0; j < 7; j++){
    m.genre.push(genre[i][j]);
  }

  for (let k = 0; k < 3; k++){
    if (movieData[i].Genre.includes(genre[i][k])){
      m.similarMovies.push(movieData[i].Title);
    }
  }
  
  m.actors = [];
  m.actorsLink = [];
  m.directors = [];
  m.directorsLink = [];
  m.writers = [];
  m.writersLink = [];

  m.url = "http://127.0.0.1:3000/movies/" + m.id;
  sampleMovies[m.id] = m;
  movieIDList.push(m.id);
  movieID = uuidv4();

  for (let j = 0; j < 4; j++){
    if (movieData[i].Actors.includes(actors[i][j])){
      m.actors.push(actors[i][j])
    } 
  }

  if (movieData[i].Director.includes(directors[i][0])){
    m.directors.push(directors[i][0])
  }

  for (let j = 0; j < 8; j++){
    if (movieData[i].Writer.includes(writers[i][j])){
      m.writers.push(writers[i][j])
    } 
  }

}

//let actorLink = sampleMovies[sampleMovies.id].actorLink.push("Tom");

fs.writeFile(path.join(".", "test-data.json"), JSON.stringify(sampleMovies), function(err){
  if(err){
    console.log("Error saving actors");
    console.log(err);
  }else{
    console.log("Movies saved");
  }
})




