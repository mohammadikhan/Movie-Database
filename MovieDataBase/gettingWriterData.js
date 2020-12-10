// Parsing relevant writer data
// DO NOT run this file, will overwrite any existing parsed data

const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');

let sampleWriters = {};
let writerIDList = [];
let writerID = uuidv4();

let movieData = require("./data/movie-data.json")
let otherData = require("./test-data.json")

let writers = [];

movieData.forEach(w=>{
    writers.push(w.Writer.split(","));
})

let newArr = [];
for (let i = 0; i < writers.length; i++){
    newArr = newArr.concat(writers[i])
}

let revisedWriters = newArr.filter((a, b)=> newArr.indexOf(a) == b);

for (let i = 0; i < revisedWriters.length; i++){
    let w = {};
    w.id = writerID;
    w.name = revisedWriters[i];
    w.works = [];
    w.movieTitles = [];
    w.actorRole = false;
    w.directorRole = false;
    w.writerRole = true;
    w.frequentCollaboratorsNames = [];
    w.frequentCollaborators = [];
  
    
    for (let key in otherData){
        if (otherData[key].writers.includes(revisedWriters[i])){
          w.works.push(otherData[key].id);
        }
    }    
    
  
    // otherData.forEach(act=>{
    //   if (act.Actors.includes(revisedActors[i])){
    //     a.works.push(act.id);
    //   }
    // })
  
    movieData.forEach(wri=>{
      if (wri.Writer.includes(revisedWriters[i])){
        w.movieTitles.push(wri.Title);
      
      }
    })
  
    w.url = "http://127.0.0.1:3000/people/" + w.id;
    sampleWriters[w.id] = w;
    writerIDList.push(w.id);
    writerID = uuidv4();
  
  }
  
  //}
  
  fs.writeFile(path.join(".", "sample-writers.json"), JSON.stringify(sampleWriters), function(err){
    if(err){
      console.log("Error saving writers");
      console.log(err);
    }else{
        console.log("Writers saved");
    }
  
  });