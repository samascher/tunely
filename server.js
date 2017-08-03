// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();
var bodyParser = require('body-parser');
var util = require('util');

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

//Body-Parser Setup
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

/************
 * DATABASE *
 ************/
var db = require('./models');


/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

app.get('/api/albums', function album_index(req, res){
  db.Album.find({}, function(err, docs) {
    if (err) {
      console.log(err);
      return;
    }
    res.json(docs);
  });
});

app.post('/api/albums', function(req, res) {
  db.Album.create({
    artistName: req.body.artistName,
    name: req.body.name,
    releaseDate: req.body.releaseDate,
    genres: [req.body.genres]
    }, function(err, doc) {
      if (err) {
        console.log(err);
        return;
      }
      doc.save();
    });
  res.json(req.body);
});

app.post('/api/albums/:album_id/songs', function(req, res) {
  console.log("HEYYYYYOOOO from the song post route.");
  console.log(req.params);
  console.log('req.body.song: ' + req.body.song + ' req.body.trackNumber: ' + req.body.trackNumber);
  // songObject = {
  //   name: req.body.song,
  //   trackNumber: req.body.trackNumber
  // };
  db.Album.findOne({ '_id': req.params.album_id }, function(err, doc) {
    if(err) throw err;
    doc.songs.push({ name: req.body.song, trackNumber: req.body.trackNumber });
    console.log('After push: ' + doc.songs);
    doc.save(function(err, savedDoc) {
      res.json(doc);
    });
  });
});

app.get('/api/albums/:id', function(req, res) {
  db.Album.findOne({ '_id': req.params.id }, function(err, doc) {
    if (err) throw err;
    console.dir('GET doc: ' + doc);
    res.json(doc);
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});