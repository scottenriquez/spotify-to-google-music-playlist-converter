var args = process.argv.slice(2);
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
    clientId : args[0],
    clientSecret : args[1]
});

spotifyApi.clientCredentialsGrant()
    .then(function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function(error) {
        console.log('Something went wrong when retrieving a Spotify access token', error);
    });
