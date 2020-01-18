'use strict';

const http = require('http');
const request = require('request'); // "Request" library
const mysql = require('mysql');

let mysql_con, token = "";
const userPath = "/user",
    albumPath = "/album",
    artistPath = "/artist",
    listPath = "/list",
    trackPath = "/track";

Initialize();

function Initialize(){
    mysql_con = mysql.createConnection({
        host: "localhost",
        user: "api_server",
        password: "7SOmyVY2UeLOfHUd"
    });

    mysql_con.connect(function(err) {
        if (err) throw err;
        console.log("Connected to mysql");
    });
//========================== auth to spotify
    const client_id = '7a5af063cd9346298dc8c2b93bac6055'; // Your client id
    const client_secret = '47a0a7552cf641ebbe782c91da793406'; // Your secret


    // your application requests authorization
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
            // use the access token to access the Spotify Web API
            token = body.access_token;
            console.log("Connected to Spotify");
        }
    });

    const server = http.createServer((function (main_req, main_res) {
        if(main_req.url === "/favicon.ico")
            return 0;
        else if(main_req.url.startsWith(userPath)){
            switch(main_req.method) {
                case "GET":
                    break;
                case "POST":
                    break;
                case "PUT":
                    break;
                case "DELETE":
                    break;
            }
        }
        else if(main_req.url.startsWith(listPath)){
            switch(main_req.method) {
                case "GET":
                    break;
                case "POST":
                    break;
                case "PUT":
                    break;
                case "DELETE":
                    break;
            }
        }
        else if(main_req.url.startsWith(trackPath)){
            switch(main_req.method) {
                case "GET":
                    break;
                case "POST":
                    break;
                case "PUT":
                    break;
                case "DELETE":
                    break;
            }
        }
        else if(main_req.url.startsWith(artistPath)){
            switch(main_req.method) {
                case "GET":
                    break;
                case "POST":
                    break;
                case "PUT":
                    break;
                case "DELETE":
                    break;
            }
        }
        else if(main_req.url.startsWith(albumPath)){
            switch(main_req.method) {
                case "GET":
                    break;
                case "POST":
                    break;
                case "PUT":
                    break;
                case "DELETE":
                    break;
            }
        }



    }));
    server.listen(7000);
    console.log("Server listening on port 7000");
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