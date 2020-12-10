let otherData = require("./test-data.json");
let actorData = require("./sample-actors.json")
let directorData = require("./sample-directors.json");
let writerData = require("./sample-writers.json");
const fs = require('fs');
const path = require('path');

//This file parses all the data for the people of the database
//DO NOT run this file since it will overwrite any other file with the required parsed data 



// for(let key in otherData){
//   for (let otherKey in actorData){
//     if (otherData[key].actors.includes(actorData[otherKey].name)){
//       otherData[key].actorsLink.push(actorData[otherKey].url);
//     }
//   }
// }

// for(let key in otherData){
//   for (let otherKey in directorData){
//     if (otherData[key].directors.includes(directorData[otherKey].name)){
//       otherData[key].directorsLink.push(directorData[otherKey].url)
//     }
//   }
// }

// for(let key in otherData){
//   for (let otherKey in writerData){
//     if (otherData[key].writers.includes(writerData[otherKey].name)){
//       otherData[key].writersLink.push(writerData[otherKey].url)
//     }
//   }
// }
 

        
for (let key in actorData){
  for (let otherKey in directorData){
    for (let i = 0; i < actorData[key].works.length; i++){
      for (let j = 0; j < directorData[otherKey].works.length; j++){
        if (actorData[key].works[i].includes(directorData[otherKey].works[j])){
          //console.log("True")
          if ((actorData[key].frequentCollaboratorsNames.length < 4 && actorData[key].frequentCollaborators.length < 4) && (directorData[otherKey].frequentCollaboratorsNames.length < 4 && directorData[otherKey].frequentCollaborators.length < 4)){
            actorData[key].frequentCollaboratorsNames.push(directorData[otherKey].name);
            actorData[key].frequentCollaborators.push(directorData[otherKey].id);
            directorData[otherKey].frequentCollaboratorsNames.push(actorData[key].name);
            directorData[otherKey].frequentCollaborators.push(actorData[key].id);
          }else{
            break;
          }
          
        
        }
      }
    }
  }
}

for (let key in writerData){
  for (let otherKey in actorData){
    for (let i = 0; i < writerData[key].works.length; i++){
      for (let j = 0; j < actorData[otherKey].works.length; j++){
        if (writerData[key].frequentCollaboratorsNames.length < 4 && writerData[key].frequentCollaborators.length < 4){
          if (writerData[key].works[i].includes(actorData[otherKey].works[j])){
            writerData[key].frequentCollaboratorsNames.push(actorData[otherKey].name);
            writerData[key].frequentCollaborators.push(actorData[otherKey].id);

          }else{
            break;
          }
        }
      }
    }
  }
}

//console.log(actorData);

// fs.writeFileSync(path.join(".", "final-movie-data.json"), JSON.stringify(otherData), function(err){
//   if(err){
//     console.log("Error saving movies");
//     console.log(err);
//   }else{
//       console.log("Movies saved");
//   }

// });

fs.writeFileSync(path.join(".", "final-actors.json"), JSON.stringify(actorData), function(err){
  if(err){
    console.log("Error saving actors");
    console.log(err);
  }else{
      console.log("Actors saved");
  }

});

fs.writeFileSync(path.join(".", "final-directors.json"), JSON.stringify(directorData), function(err){
  if(err){
    console.log("Error saving directors");
    console.log(err);
  }else{
      console.log("Directors saved");
  }

});

fs.writeFileSync(path.join(".", "final-writers.json"), JSON.stringify(writerData), function(err){
  if(err){
    console.log("Error saving writers");
    console.log(err);
  }else{
      console.log("Writers saved");
  }

});


// console.log(actorData);
// console.log(directorData);
// console.log(writerData);

// for (let key in actorData){

//   for (let i = 0; i < actorData[key].works.length; i++){
//     if (console.log(actorData[key].works[i].includes("9a969272-3134-4bee-be6d-93cb6f3595f6"))){
//       console.log("True")
//     }
//   }
// }

//console.log("Hello");
