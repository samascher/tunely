var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// var song = require('./song.js');
// var SongSchema = require('Song').schema;

var SongSchema = new Schema ({
	 name: String,
  	 trackNumber: Number
});

var AlbumSchema = new Schema({
  artistName: String,
  name: String,
  releaseDate: String,
  genres: [ String ],
  songs: [SongSchema]
});

var Album = mongoose.model('Album', AlbumSchema);

module.exports = Album;