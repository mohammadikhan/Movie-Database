// Parsing relevant actor data
// DO NOT run this file, will overwrite any existing parsed data

const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');

let sampleActors = {}
let actorIDList = [];
let actorID = uuidv4();

let movieData = require("./data/movie-data.json")
let otherData = require("./test-data.json")
let directorData = require("./sample-directors.json")
// let movieData = require("./test-data.json")

let actors = [];
let works = [];
// movieData.forEach(a=>{

 
//   const getName = a.Actors.split(",");
//   let getWorks = "http://127.0.0.1:3000/displayMovieInfo/";

//   //const displayName = getName[0] + " " + getName[1] + " " + getName[2];

//   if (a.Actors.includes(getName)){
//     let getWorks = "http://127.0.0.1:3000/displayMovieInfo/" + a.imdbID;
//     works.push(getWorks)
//   }

//   actors.push(getName);
  
//   //actors.push(getName);
//  // works.push(getWorks)
// })

movieData.forEach(a=>{
  actors.push(a.Actors.split(","));
})

let newArr = [];

for (let i = 0; i < actors.length; i++){
    newArr = newArr.concat(actors[i])
}


let revisedActors = newArr.filter((a, b)=> newArr.indexOf(a) == b)

// console.log(revisedActors)
fs.writeFileSync(path.join(".", "getActors.json"), revisedActors, function(err){

})

console.log(revisedActors[0])

// let revisedActors = actors.filter((a, b)=> actors.indexOf(a) == b)

//for (let i = 0; i < movieData.length; i++){
for (let i = 0; i < revisedActors.length; i++){
  let a = {};
  a.id = actorID;
  a.name = revisedActors[i];
  a.works = [];
  a.movieTitles = [];
  a.actorRole = true;
  a.directorRole = false;
  a.writerRole = false;
  a.frequentCollaboratorsNames = [];
  a.frequentCollaborators = [];

  
  for (let key in otherData){
    if (otherData[key].actors.includes(revisedActors[i])){
      a.works.push(otherData[key].id);
    }
  }

  // otherData.forEach(act=>{
  //   if (act.Actors.includes(revisedActors[i])){
  //     a.works.push(act.id);
  //   }
  // })

  movieData.forEach(act=>{
    if (act.Actors.includes(revisedActors[i])){
      a.movieTitles.push(act.Title);
    
    }
  })

  a.url = "http://127.0.0.1:3000/people/" + a.id;
  sampleActors[a.id] = a;
  actorIDList.push(a.id);
  actorID = uuidv4();

}

//}

fs.writeFile(path.join(".", "sample-actors.json"), JSON.stringify(sampleActors), function(err){
  if(err){
    console.log("Error saving actors");
    console.log(err);
  }else{
      console.log("Actors saved");
  }

});

// console.log(otherData["afc8fad7-bbbc-4825-acda-5fc9364e486e"])

// console.log(otherData[Object.keys(otherData)[0]].actors[0].includes(revisedActors[0]))

// for (let key in otherData){
//   console.log(otherData[key].actors);
// }

