var SpotifyWebApi = require('spotify-web-api-node');
var PlayMusic = require('playmusic');

var args = process.argv.slice(2);
var spotifyClientId = args[0];
var spotifyClientSecret = args[1];
var spotifyTargetUsername = args[2];
var spotifyTargetPlaylistId = args[3];
var googlePlayEmailAddress = args[4];
var googlePlayPassword = args[5];
var newPlaylistName = args[6];

var spotifyApi = new SpotifyWebApi({
    clientId : spotifyClientId,
    clientSecret : spotifyClientSecret
});
spotifyApi.clientCredentialsGrant()
    .then(function(clientCredentialData) {
        spotifyApi.setAccessToken(clientCredentialData.body['access_token']);
        spotifyApi.getPlaylist(spotifyTargetUsername, spotifyTargetPlaylistId)
            .then(function(playlistData) {
                var spotifyPlaylistTracks = playlistData.body.tracks.items;
                var playMusicApi = new PlayMusic();
                playMusicApi.init({
                    email: googlePlayEmailAddress,
                    password: googlePlayPassword
                }, function(googlePlayConnectionError) {
                    if (googlePlayConnectionError) {
                        console.log('Something went wrong when connecting to Google Play', googlePlayConnectionError)
                    }
                    else {
                        playMusicApi.addPlayList(newPlaylistName, function(googlePlayPlaylistCreationError) {
                            if (googlePlayConnectionError){
                                console.log('Something went wrong when creating a new Google Play playlist', googlePlayPlaylistCreationError)
                            }
                            else {
                                spotifyPlaylistTracks.forEach(function(song) {
                                    var searchText = song.track.name + ' ' + song.track.artists[0].name;
                                    playMusicApi.search(searchText, 25, function(googlePlaySearchError, googlePlaySearchData) {
                                        if (googlePlaySearchError) {
                                            console.log('Something went wrong when searching for a song', googlePlaySearchError);
                                        }
                                        else {
                                            var result = googlePlaySearchData.entries
                                                .filter((item, index) => item.type === '1')
                                                .sort((first, second) => first.score > second.score)
                                                .shift();
                                            console.log(result);
                                        }
                                    });
                                });
                            }
                        });
                    }
                });
            }, function(playlistError) {
                console.log('Something went wrong when fetching playlist', playlistError);
            });
    }, function(clientCredentialError) {
        console.log('Something went wrong when retrieving a Spotify access token', clientCredentialError);
    });