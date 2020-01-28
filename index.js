'use strict';

const express = require("express");
const request = require('request'); // "Request" library
const mysql = require('mysql');

const AlbumController = require("./v1/controllers/Album");
const ArtistController = require("./v1/controllers/Artist");
const TrackController = require("./v1/controllers/Track");
const UserController = require("./v1/controllers/User");

let mysql_con, token;

try {
    Initialize();
}catch (e) {
    console.log(e.toString());
}
function Initialize(){

    //============================ connect with database
    mysql_con = mysql.createConnection({
        host: "localhost",
        user: "api_server",
        password: "7SOmyVY2UeLOfHUd",
        database: "alaspotify_database"
    });

    mysql_con.connect(function(err) {
        if (err){
            console.log("Can not connect to database");
            return 0;
        }
        console.log("Connected to mysql");
    });

    //============================ authorize in Spotify
    const client_id = '7a5af063cd9346298dc8c2b93bac6055'; // Your client id
    const client_secret = '47a0a7552cf641ebbe782c91da793406'; // Your secret
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };
    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            token = body.access_token;
            console.log("Connected to Spotify");
        }else{
            throw error;
        }
    });
    //================ middleware login = todo

    //============================= services initialization, set endpoints
    const app = express();
    const userPath = "/user",
        albumPath = "/album",
        artistPath = "/artist",
        listPath = "/list",
        trackPath = "/track";

    //==== album <- spotify data
    app.get('/v1'+albumPath, function (req, res) {
        AlbumController.getAlbums(req, res, token);
    });

    app.get('/v1'+albumPath+'/:id', function (req, res) {
        AlbumController.getAlbum(req, res, token);
        //0tKX7BLXiiRgXUKYdJzjEz
    });
    //==== artist <- spotify data
    app.get('/v1'+artistPath, function (req, res) {
        ArtistController.getArtists(req, res, token);
    });

    app.get('/v1'+artistPath+'/:id', function (req, res) {
        ArtistController.getArtist(req, res, token);
    });
    //==== track <- spotify data
    app.get('/v1'+trackPath, function (req, res) {
        TrackController.getTracks(req, res, token);
    });

    app.get('/v1'+trackPath+'/:id', function (req, res) {
        TrackController.getTrack(req, res, token);
    });

    //=========== user
    app.get('/v1'+userPath, function (req, res) {
        UserController.getUsers(req, res, mysql_con);
    });

    app.post('/v1'+userPath, function (req, res) {
        UserController.addUser(req, res, mysql_con);
    });

    app.get('/v1'+userPath+'/:id', function (req, res) {
        UserController.getUser(req, res, mysql_con);
    });

    app.put('/v1'+userPath+'/:id', function (req, res) {
        UserController.updateUser(req, res, mysql_con);
    });

    app.delete('/v1'+userPath+'/:id', function (req, res) {
        UserController.destroyUser(req, res, mysql_con);
    });




    //================ start server
    const server = app.listen(7000, function () {
        let host = server.address().address;
        let port = server.address().port;
        console.log("Server listening at http://%s:%s", host, port);
    });
}

// //request to spotify
// let options = {
//     url: 'https://api.spotify.com/v1/search?q=a&type=artist',
//     headers: {
//         'Authorization': 'Bearer ' + token
//     },
//     json: true
// };
// request.get(options, function(error, response, body) {
//     if (!error && response.statusCode === 200){
//         artists = body.artists.items;
//         console.log(artists[0].name);
//         main_res.writeHead(200,
//             {"Content-Type": "text/plain"});
//         main_res.end(main_req.url+" Loaded\n");
//     }
//
// });