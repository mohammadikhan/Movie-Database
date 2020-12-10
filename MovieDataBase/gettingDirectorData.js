// Parsing relevant director data
// DO NOT run this file, will overwrite any existing parsed data


const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');

let sampleDirectors = {};
let directorIDList = [];
let directorID = uuidv4();

let movieData = require("./data/movie-data.json")
let otherData = require("./test-data.json")

let directors = [];

movieData.forEach(d=>{
    directors.push(d.Director.split(","));
})

let newArr = [];
for (let i = 0; i < directors.length; i++){
    newArr = newArr.concat(directors[i])
}

let revisedDirectors = newArr.filter((a, b)=> newArr.indexOf(a) == b)

for (let i = 0; i < revisedDirectors.length; i++){
    let d = {};
    d.id = directorID;
    d.name = revisedDirectors[i];
    d.works = [];
    d.movieTitles = [];
    d.actorRole = false;
    d.directorRole = true;
    d.writerRole = false;
    d.frequentCollaboratorsNames = [];
    d.frequentCollaborators = [];
  
    for (let key in otherData){
        if (otherData[key].directors.includes(revisedDirectors[i])){
          d.works.push(otherData[key].id);
        }
    }
  
    // otherData.forEach(act=>{
    //   if (act.Actors.includes(revisedActors[i])){
    //     a.works.push(act.id);
    //   }
    // })
  
    movieData.forEach(dir=>{
      if (dir.Director.includes(revisedDirectors[i])){
        d.movieTitles.push(dir.Title);
      
      }
    })
  
    d.url = "http://127.0.0.1:3000/people/" + d.id;
    sampleDirectors[d.id] = d;
    directorIDList.push(d.id);
    directorID = uuidv4();
  
  }
  
  //}


  
  fs.writeFile(path.join(".", "sample-directors.json"), JSON.stringify(sampleDirectors), function(err){
    if(err){
      console.log("Error saving directors");
      console.log(err);
    }else{
        console.log("Directors saved");
    }
  
  });