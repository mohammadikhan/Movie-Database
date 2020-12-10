

// Creating an express object and requiring the use of an express session, path, fs and uuidv4 (to generate unique id)
const express = require('express');
const app = express();
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');

app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Used to set the view engine to pug (pug is the template engine that is used in this application)
app.set("view engine", "pug");

// Requiring all necessary data for the movies and the actors, writers and directors
let movieData = require("./data/final-movie-data.json");
let actorData = require("./data/final-actors.json");
let directorData = require("./data/final-directors.json");
let writerData = require("./data/final-writers.json");
let peopleData = require("./data/newPeople.json");

// This represents users that are apart of the database and can be used to log in and use the web application
let users = [{id: "0", username: "mohammadikhan", password: "abcdefgh", followers: ["dave", "george"], usersFollowing: [], peopleFollowing: ["Christopher Nolan"], reviews: [], accountType: true, recommendedMovies: []},
{id: "1", username: "george", password: "abcdefgh", followers: [], usersFollowing: [], peopleFollowing: [], reviews: [], accountType: false, recommendedMovies: []},
{id: "2", username: "dave", password: "abcdefgh", followers: [], usersFollowing: [], peopleFollowing: [], reviews: [], accountType: false, recommendedMovies: []},
{id: "3", username: "drake", password: "abcdefgh", followers: [], usersFollowing: [], peopleFollowing: [], reviews: [], accountType: false, recommendedMovies: []},
{id: "4", username: "user1", password: "abcdefgh", followers: [], usersFollowing: [], peopleFollowing: [], reviews: [], accountType: false, recommendedMovies: []},
{id: "5", username: "david", password: "abcdefgh", followers: [], usersFollowing: [], peopleFollowing: [], reviews: [], accountType: false, recommendedMovies: []},
{id: "6", username: "ian", password: "abcdefgh", followers: [], usersFollowing: [], peopleFollowing: [], reviews: [], accountType: false, recommendedMovies: []},
{id: "7", username: "isacc", password: "abcdefgh", followers: [], usersFollowing: [], peopleFollowing: [], reviews: [], accountType: false, recommendedMovies: []},
{id: "8", username: "daniel", password: "abcdefgh", followers: [], usersFollowing: [], peopleFollowing: [], reviews: [], accountType: false, recommendedMovies: []},
{id: "9", username: "greatone", password: "abcdefgh", followers: [], usersFollowing: [], peopleFollowing: [], reviews: [], accountType: false, recommendedMovies: []},
{id: "10", username: "niceone", password: "abcdefgh", followers: [], usersFollowing: [], peopleFollowing: [], reviews: [], accountType: false, recommendedMovies: []},
{id: "11", username: "sam", password: "abcdefgh", followers: [], usersFollowing: [], peopleFollowing: [], reviews: [], accountType: false, recommendedMovies: []},
{id: "12", username: "samuel", password: "abcdefgh", followers: [], usersFollowing: [], peopleFollowing: [], reviews: [], accountType: false, recommendedMovies: []},
];


// Creating a cookie for the user that is going to be logging in
app.use(session({
  
  cookie:{
    maxAge: 50000000000000
  },
  secret: 'some secret'

}));

// Printing to the console the session that displays the cookie, when it expires and its max age (time the session can run for)
app.use("/", function (req, res, next){
  console.log(req.session);

  next();
})


// Creating all necessary get and post request which renders a specific template engine or will call a function
// to perform a specfic task (will add the remaining ones later on and implement their functionality)
app.get("/", (req, res, next)=>{ res.render("login.pug")});
app.get("/login", (req, res, next)=>{ res.render("login.pug")});
// app.get("/login", loginPage)
// app.get("/homePage", (req, res, next)=>{ res.render("homePage.pug")});
//app.get("/searchForMovies", (req, res, next)=>{ res.render("searchForMovies.pug")});
// app.get("/users", (req, res, next)=>{ res.render("searchForUsers.pug")});
app.get("/signupPage", (req, res, next)=>{ res.render("signupPage.pug")});
app.get("/displayUser/:uid", (req, res, next)=>{ res.render("displayUser.pug")});
app.get("/displayFollowers", (req, res, next)=>{ res.render("displayFollowers.pug")});
app.get("/addPeople", (req, res, next)=>{ res.render("addPeople.pug")});
app.get("/addMovie", (req, res, next)=>{ res.render("addMovie.pug")});


app.get("/homePage", homePage)
app.get("/movies/:id", getMovie);         // Getting a specific movie by ID
app.get("/people/:id", getPeople);            // Getting a specific person by ID (which relates to either an actor, director or writer, will fix this later on)
app.get("/people", parsePersonQuery, getFinalPeople);
app.post("/people", searchForPeople)
app.get("/users", parseUserQuery, getFinalUser);
app.get("/users/:id", getUser)

app.get("/movies", parseQuery, getFinalMovies);  // Searching for a movie
app.post("/movies", searchForMovies);  
app.post("/users", searchForUsers);    // Searching for a user

app.get("/logOut", logout);             // Logging out a User

app.post("/loginUser", loginUser);
app.post("/signupPage", createAccount, loginUser);


function homePage(req, res, next){

  let recommendedMovies = [];
  
  recommendedMovies.push(movieData["02b4a69d-cb10-400a-b8e3-7c90da4c4f9b"])
  recommendedMovies.push(movieData["c8ac8c14-cd74-407d-b21c-8949d82e644a"])
  recommendedMovies.push(movieData["1555d1f3-9ed0-40c9-b241-bf04cd30b143"])

  res.render("homePage.pug", {movies: recommendedMovies})
}

// This function renders the login page with the corresponding session for the particular user
function loginPage(req, res){
  res.render("login.pug", {session: req.session})
}

// This is the login function, which allows the user to log in to their account
// if they already have an account. If they don't, status code 401 will be sent
// since their username and password will be incorrect.

function loginUser(req, res, next){

  // First check to see if the user is already logged in and send back a
  // response to tell them that they are alredy logged in.
  if (session.loggedin == true){
    res.send("Already Logged in");
  
  }
  else{

    // Else, check to see if they can log in:

    let loggedUser = req.body; // Checking the body to get the username and password that they type

    let authenticated = true;   // Originaly, authentication is true


    // Loop through the user that are apart of the database and check to see if there username and 
    // password is corrct
    users.forEach(u=>{

      if (loggedUser.username === u.username && loggedUser.password === u.password){
        console.log("User Found!");

        authenticated = false;            // Set their authentication to false (since they can log in)
        req.session.username = loggedUser.username;   // Set the username in the session to their username of their account
        req.session.loggedin = true;                  // Set the loggedin boolean to true in the session of the user

        // Rendering page to display the profile
        res.status(200).redirect(`/users/${u.id}`)
      
      }
    

    })

    // Else if they entered their username or password incorrectly, status code 401 is sent 
    if(authenticated){
      res.status(401).send("Wrong username or password, please try again!");
    }
  }
   
}

// This function will get a specific user based on the search the user performs
// If found their page will be rendered and the user who searched for it can see
// the details for their account (this functionality has not been implemented yet, still need to fix it)

function getUser(req, res){
  let userResults = [];

  users.forEach(u=>{
    if (req.params.id === u.id){
      userResults.push(u)
      
      res.format({
        "text/html": function(){
          res.status(200).render("userPage.pug", {user: u, session: req.session})
        },
        "application/json": function(){
          res.status(200).json(userResults)
        }
      })
      
    }
  })

}

// This function logs out the user from their session on the database
// It will destroy the session and redirect them back to the login page

function logout(req, res){
  req.session.destroy();
  res.redirect('/login');

}

//--> (Function is not used, used for testing to create an account in the database (may re use or change implementation later on))
// For TA's: I may remove this function later on, will change if needed, can read the function to see what it does (is not used, used for testing
// in earlier stages)

function createAccount(req, res, next){
  
  let newAccount = req.body;

  if (newAccount.username === null || newAccount.password === null){
    res.status(300).redirect("signupPage.pug")
  }else if (users.hasOwnProperty(newAccount.username)){
    res.status(300).send("That username is already takeen. Try again!")
  
  }
  else{
    newAccount.id = uuidv4();
    newAccount.followers = [];
    newAccount.usersFollowing = [];
    newAccount.peopleFollowing = [];
    newAccount.reviews = [];
    newAccount.accountType = false;
    newAccount.recommendedMovies = [];

    users.push(newAccount)
    console.log(users)
    next();
  }
  
}



// This function will get a specifc person (Actor, Writer, Director) that exits in the database by ID
// It will render the page for that specifc person determining whether they are an actor, writer, or
// director, an option to follow them (have not implemented this functionality yet) and the movies they have
// been apart of (which will allow the user to navigate to that movies and see the details of that particular movie)

function getPeople(req, res, next){
  let id = req.params.id;
  let searchResults = [];

  // Loops through all the people that are apart of the database and if a specific person is
  // found, this person is added to the searchresults array
  for (id in peopleData){
    if (peopleData[id].id === req.params.id){
      searchResults.push(peopleData[id]);
      break;
    }
  }
  
  // Displaying the search results for the person seached for as well as the unique id that was searched for
  console.log(searchResults)
  console.log(id);

  // Sending status code 200 and rendering page to display info for the searched person
  res.format({
    "text/html": function(){
      res.status(200).render("people.pug", {people: searchResults})
    },
    "application/json": function(){
      res.status(200).json(searchResults)
    }
  })

}

// This function will get a specific movie based on the ID (still need to fix ID for the movies so that they are uuidv4 unique ID's)
// and displays the basic movie information for the specific movie that is earched including the plot, released data, actors, directors,
// writers, average rating, runtime and genre (still working on creating navigatble links for the actors, directors, and genre)

function getMovie(req, res, next){
  let id = req.params.id;
  let searchResults = [];

  console.log(id);


  // Goes through all the movies in the movie-data JSON file and checks if the id matches the one
  // that is being searched and adds it to the search results
  for (let key in movieData){
    if (movieData[key].id.includes(id)){
      console.log(movieData[key].title);
      searchResults.push(movieData[key]);
    }
  }
  

  // Sending status code 200 and rendering page to display movie that matches the search
  res.format({
    "text/html": function(){
      res.status(200).render("movies.pug", {movie: searchResults, session: req.session})
    },
    "application/json": function(){
      res.status(200).json(searchResults)
    }
  })
}


//--> (Function is not used, used for testing to search for an user in the database (may re use or change implementation later on))

// For TA's: I may remove this function later on, will change if needed, can read the function to see what it does (is not used, used for testing
// in earlier stages)

function searchForUsers(req,res,next){
  let body = req.body;
  let foundUsers = [];

  users.forEach(u=>{

    if(u.username.toLowerCase().includes(body.searchUser.toLowerCase())){
      console.log("Found User: " + u.username)
      foundUsers.push(u);
      return;
    }
    
  })

  res.format({
    "text/html": function(){
      res.status(200).render("searchForUsers.pug", {user: foundUsers})
    },
    "application/json": function(){
      res.status(200).json(foundUsers)
    }
  })

}

// This function seaches for all the movies in the database based on the title of the movie, the actor
// of the movie, the diretor of the movie, the writer of the movie, the genre of the movie, or the year in which
// it was realeased. It will display all results that match the search contraints which will have a navigatebale link 
// to the movie which will display the information of the movie (as stated before) as well as the poster of the movie (to distinguish
// if any movie were to have the same name (such as when you search for "The Avengers", two movies of the same name will come up)) 

function searchForMovies(req, res, next){
  let body = req.body;
  console.log(body);

  let searchResults = [];
  req.session.loggedin = true;
  
  for (let key in movieData){
  // Going through all the movies in the database and checking to see if each condition is met
  //movieData.forEach(m => {
    
    // If user searches for a movie based on title, all results matching the search will be added to the serachResults array and 
    // the movie title (navigateable link and poster) will show up. Also logs to the console that the movie was found and clarifies this by displaying
    // the plot and poster.
    if (movieData[key].title.toLowerCase().includes(body.searchMovie.toLowerCase())){
      console.log("Found " + movieData[key].title);
      //console.log("Plot: " + movieData[key].plot);
      //console.log("Poster: " + movieData[key].poster);
      searchResults.push(movieData[key]);

    // If user searches for a movie based on the name of an actor, all results matching the search will be added to the serachResults array and 
    // the movie title (navigateable link and poster) will show up. Also logs to the console that the actor was found and clarifies this by displaying
    // the movies in which they have been in.
    }
    for (let i = 0; i < movieData[key].genre.length; i++){
      if (movieData[key].genre[i] == null){
        continue;
      }
     if(movieData[key].genre[i].toLowerCase().includes(body.searchMovie.toLowerCase())){
        console.log("Found Genre " + body.searchMovie.toLowerCase());
        //console.log("List of movies this person has been in: " + movieData[key].title);
        searchResults.push(movieData[key]);
    }
   }
  }
    
  //Sending status code 200 and rendering template engine to display the movies that matched the search made by the user
  res.format({
    "application/json": function(){
      res.status(200).json(searchResults);
    },
    "text/html": () => {res.status(200).render("searchForMovies.pug" ,{movie: searchResults, qstring: req.qstring, current: req.query.page, session: req.session})}

  })
  //res.status(200).render("searchForMovies.pug" ,{movie: searchResults, qstring: req.qstring, current: req.query.page})


}

function searchForPeople(req, res, next){
  let body = req.body;
  console.log(body);

  let searchResults = [];
  
  for (let key in peopleData){
  // Going through all the movies in the database and checking to see if each condition is met
  //movieData.forEach(m => {
    
    // If user searches for a movie based on title, all results matching the search will be added to the serachResults array and 
    // the movie title (navigateable link and poster) will show up. Also logs to the console that the movie was found and clarifies this by displaying
    // the plot and poster.
    if (peopleData[key].name.toLowerCase().includes(body.searchMovie.toLowerCase())){
      console.log("Found " + peopleData[key].name);
      searchResults.push(peopleData[key]);

    }
  }

  res.format({
    "application/json": function(){
      res.status(200).json(searchResults);
    },
    "text/html": () => {res.status(200).render("searchForPeople.pug" ,{people: searchResults, qstring: req.qstring, current: req.query.page})}

  })


}

function parseQuery(req, res, next){

  req.movieParams = {};
  
  for (let key in movieData){
    if (req.query.title && movieData[key].title.toLowerCase().includes(req.query.title.toLowerCase())){
        req.movieParams.title = req.query.title;

        console.log("Movies must have the title: " + req.query.title);
        
        
    }


      
    if (req.query.genre && movieData[key].genre.map(m=>m.toLowerCase()).includes(req.query.genre.toLowerCase())){
        req.movieParams.genre = req.query.genre;

        console.log("Movies must have been this genre: " + req.query.genre);
    }

    if (req.query.year && movieData[key].year.includes(req.query.year)){
        req.movieParams.year = req.query.year;

        console.log("Movies must have been releasd this year: " + req.query.year);
    }

    for (let i = 0; i < movieData[key].basicReviews.length; i++){
      if (req.query.minrating && (movieData[key].basicReviews[i] / movieData[key].basicReviews.length) >= parseInt(req.query.minrating)){
        req.movieParams.minrating = req.query.minrating;
        console.log("Movies must have the minimum rating: " + req.query.minrating);
      }
        

    }

    

  }


  console.log(req.movieParams)

  next();

}

function getFinalMovies(req, res, next){
  let finalMovies = [];

  for (let id in movieData){    
    let currentMovie = movieData[id];

    let movieFound = 
    ((!req.movieParams.year) || (currentMovie.year.toLowerCase().includes(req.movieParams.year.toLowerCase())))
    &&
    ((!req.movieParams.title) || (currentMovie.title.toLowerCase().includes(req.movieParams.title.toLowerCase())))
    &&
    ((!req.movieParams.genre) || (currentMovie.genre.map(m => m.toLowerCase()).includes(req.movieParams.genre.toLowerCase())))
    &&
    ((!req.movieParams.minrating) || ((currentMovie.basicReviews.reduce((a,b)=> a + b, 0) / currentMovie.basicReviews.length) >= parseInt(req.movieParams.minrating)))

    if (movieFound){
      finalMovies.push(currentMovie);
    }
    
  }

  res.format({
    "text/html" : function(){
      
      if (finalMovies.length == null){
        res.status(404).send(JSON.stringify(finalMovies))
      }else{
        res.render("searchForMovies.pug", {movie: finalMovies})
      }
    },


    "application/json": function(){
      if (finalMovies.length == null){
        res.status(404).send(JSON.stringify(finalMovies))
      }
      else{
        res.status(200).send(JSON.stringify(finalMovies))
      }
    }
  })
}

function parsePersonQuery(req, res, next){

  req.personParams = {};

  for (let key in peopleData){
    if (req.query.name && peopleData[key].name.toLowerCase().includes(req.query.name.toLowerCase())){
      req.personParams.name = req.query.name;

      console.log("Person must have the name: " + req.query.name);
      
    }
    
  }

  next();
}

function getFinalPeople(req, res, next){

  let finalPeople = [];

  for (let id in peopleData){
    let currentPerson = peopleData[id];
    
    let personFound = 
    ((!req.personParams.name) || (currentPerson.name.toLowerCase().includes(req.personParams.name.toLowerCase())))

    if (personFound){
      finalPeople.push(currentPerson);
    }

  }

  res.format({
    "text/html" : function(){
      
      if (finalPeople.length == null){
        res.status(404).send(JSON.stringify(finalPeople))
      }else{
        res.render("searchForPeople.pug", {people: finalPeople})
      }
    },


    "application/json": function(){

      if (finalPeople.length == null){
        res.status(404).send(JSON.stringify(finalPeople))
      }
      else{
        res.status(200).send(JSON.stringify(finalPeople))
      }
    }
  })

}


function parseUserQuery(req, res, next){

  req.userParams = {};

  for (let key in users){
    if (req.query.name && users[key].username.toLowerCase().includes(req.query.name.toLowerCase())){
      req.userParams.name = req.query.name;

      console.log("Person must have the name: " + req.query.name);
      
    }
    
  }

  next();

}

function getFinalUser(req, res, next){
  let finalUser = [];

  
    for (let key in users){
      let personFound = 
      ((!req.userParams.name) || (users[key].username.toLowerCase().includes(req.userParams.name.toLowerCase())))

      if (personFound){
        finalUser.push(users[key]);
      }
    }
  

  res.format({
    "text/html" : function(){
      
      if (finalUser.length == null){
        res.status(404).send(JSON.stringify(finalUser))
      }else{
        res.render("searchForUsers.pug", {user: finalUser})
      }
    },


    "application/json": function(){

      if (finalUser.length == null){
        res.status(404).send(JSON.stringify(finalUser))
      }
      else{
        res.status(200).send(JSON.stringify(finalUser))
      }
    }
  })

}

app.listen(3000);
console.log("Server running at http://127.0.0.1:3000");