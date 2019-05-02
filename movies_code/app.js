
const express = require("express")
const hbs = require('hbs');
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bodyParser = require('body-parser')
const path = require('path');
const app = express()
const querystring = require('querystring')

// //Register Partials and Set View Engine
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// //Connect to Mongoose
mongoose.connect('mongodb://localhost/movieDB', {useNewUrlParser: true}, (err, x) => {
  if(!err)console.log("connected to mongoose")
  else console.log("cannot connect to mongoose", err)
})

// // //Create Schema
const MovieSchema = new Schema({
  title : {type:String},
  year : {type:String},
  director : {type:String},
  duration : {type:String}
})

const Movie = mongoose.model("movies", MovieSchema)

app.get("/", (req, res) => {
  Movie.find({}, (err, result)=> {
    res.render("index", {movies: result})
  })
})

app.get("/detail", (req, res) => {
  var objectId = mongoose.Types.ObjectId(req.query.id);
  Movie.find({_id : objectId}, (err, result) => {
    res.render("movie_details", result[0])
  })
})


app.get("/movie-add", (req, res)=> {
  res.render("movie-add")
})

app.post("/movie-add", (req, res)=> {
  const newMovie = {title, year, director, duration} = req.body
  Movie.create(newMovie, (err)=> {
      if(err) res.send("ERROR")
      else res.redirect("/")
  })
})

app.get("/movie-delete", (req, res) => {
  var objectId = mongoose.Types.ObjectId(req.query.id);
  Movie.findByIdAndDelete({_id:objectId}).then(result => {
    res.redirect("/")
  }).catch(err => {
    throw err;
  })
})

app.get("/movie-edit", (req, res) => {
  var objectId = mongoose.Types.ObjectId(req.query.id);
  Movie.findOne({_id : objectId} , (err, result) => {
    res.render("movie-edit", {movie : result})
  })
})

app.post("/movie-edit", (req, res) => {
  var objectId = mongoose.Types.ObjectId(req.query.id);
  const updatedMovie = req.body
  Movie.updateOne({_id : objectId}, {$set: updatedMovie}, (err, result) => {
    res.redirect("/")
  })
})

app.listen(3000, ()=> {
  console.log("Listening!!!!!")
})