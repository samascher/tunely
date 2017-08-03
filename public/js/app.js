$(document).ready(function() {
  //grab Kanye Albums from backend and immediately render them
  $.ajax({url: '/api/albums', success: function(result) {
    result.forEach(renderAlbum);
  }});

  //serialize form data
  $('form').on('submit', function(event) {
    event.preventDefault();
    var formData = $('form').serialize();
    $.post('/api/albums', formData).done(function() {
      console.log('Form data posted.');
      $.ajax({ url: '/api/albums', success:function(result) {
        var $albums = $('#albums');
        $albums.empty();
        result.forEach(renderAlbum);
      }});
    });
    $('form').trigger('reset');
  });

  $('#albums').on('click', '.add-song', function(e) {
    /* CLIENT-SIDE JS */
    var id = $(this).parents('.album').data('album-id'); // "5665ff1678209c64e51b4e7b"
    console.log('id', id);
    $('#songModal').data('album-id', id);
    $('#songModal').modal();
    $('#saveSong').click(function(event) {
      console.log(id);
      var $song = $('#songName').val();
      var $trackNumber = $('#trackNumber').val();
      var stuffToAjax = {
        song: $song,
        trackNumber: parseInt($trackNumber)
      };
      console.log(stuffToAjax.trackNumber + '. ' + '"' + stuffToAjax.song + '"');
      event.preventDefault();
      var URL = '/api/albums/' + id + '/songs';
      $.post(URL, stuffToAjax).done(function() {
        $.ajax({url: '/api/albums/' + id, success: function(result) {
          console.dir(result);
          console.log(id);
          var $targetedAlbum = $('data-album-id[value=' + result._id + ']');
          $targetedAlbum.remove();
          renderAlbum(result);
        }});
      });
      $('#songModal').modal('hide');
    });
  });
});


function renderAlbum(album) {
  var albumHtml =
  "        <!-- one album -->" +
  "        <div class='row album' data-album-id='" + album._id + "'>" +
  "          <div class='col-md-10 col-md-offset-1'>" +
  "            <div class='panel panel-default'>" +
  "              <div class='panel-body'>" +
  "              <!-- begin album internal row -->" +
  "                <div class='row'>" +
  "                  <div class='col-md-3 col-xs-12 thumbnail album-art'>" +
  "                     <img src='" + "http://placehold.it/400x400'" +  " alt='album image'>" +
  "                  </div>" +
  "                  <div class='col-md-9 col-xs-12'>" +
  "                    <ul class='list-group'>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Album Name:</h4>" +
  "                        <span class='album-name'>" + album.name + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Artist Name:</h4>" +
  "                        <span class='artist-name'>" +  album.artistName+ "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Released date:</h4>" +
  "                        <span class='album-releaseDate'>" + album.releaseDate + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Genres:</h4>" +
  "                        <span class='album-genres'>" + album.genres + "</span>" +
  "                      </li>" +
  "                     <li class='list-group-item'>" +
  "                       <h4 class='inline-header'>Songs:</h4>" + 
  "                       <span class='song_list'>" + buildSongsHTML(album.songs) + "</span>" +
  "                     </li>" +
  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +
  "              </div>" + // end of panel-body
  "              <div class='panel-footer'>" +
  "               <button class='btn btn-primary add-song'>Add Song</button>" +
  "              </div>" +
  "            </div>" +
  "            </div>" +
  "          <!-- end one album -->";
     $('#albums').prepend(albumHtml);
}

function buildSongsHTML(songs) {
  var songText = '- ';
  var songsHTML = " ";
  songs.forEach(function(song) {
    songText = '(' + song.trackNumber + ') ' + song.name + ' -';
    songsHTML += songText + " ";
  });
  console.log(songsHTML);
  return songsHTML;
}