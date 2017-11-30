var SpotifyWebApi = require('spotify-web-api-node');

var args = process.argv.slice(2);
var spotifyClientId = args[0];
var spotifyClientSecret = args[1];
var spotifyTargetUsername = args[2];
var spotifyTargetPlaylistId = args[3];

var spotifyApi = new SpotifyWebApi({
    clientId : spotifyClientId,
    clientSecret : spotifyClientSecret
});
spotifyApi.clientCredentialsGrant()
    .then(function(clientCredentialData) {
        spotifyApi.setAccessToken(clientCredentialData.body['access_token']);

        spotifyApi.getPlaylist(spotifyTargetUsername, spotifyTargetPlaylistId)
            .then(function(playlistData) {
                console.log(playlistData.body);
            }, function(playlistError) {
                console.log('Something went wrong when fetching playlist', playlistError);
            });
    }, function(clientCredentialError) {
        console.log('Something went wrong when retrieving a Spotify access token', clientCredentialError);
    });
