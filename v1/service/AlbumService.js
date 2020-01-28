'use strict';
const request = require("request");
let dictAlbums = {};

exports.getAlbum = function(id, token) {
        return new Promise(function(resolve, reject) {
            if(!dictAlbums)
                dictAlbums = {};

            if(!(id in dictAlbums)){

                let options = {
                    url: "https://api.spotify.com/v1/albums/"+id,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    json: true
                };
                request.get(options, function(error, response, body) {
                    if(error)
                        reject(error);
                    if (response.statusCode === 200){
                        dictAlbums[id] = body;
                        resolve(body);
                    }
                    else{
                        resolve({});
                    }
                });
            }
            else
                resolve(dictAlbums[id]);
        });
    };

//=====================================================
// {
//     "album_type":"album",
//     "artists":[],
//     "available_markets":[],
//     "copyrights":[],
//     "external_ids":{},
//     "external_urls":{},
//     "genres":[],
//     "href":"https://api.spotify.com/v1/albums/0tKX7BLXiiRgXUKYdJzjEz",
//     "id":"0tKX7BLXiiRgXUKYdJzjEz",
//     "images":[],
//     "label":"TenThousand Projects, LLC",
//     "name":"A Love Letter To You 4",
//     "popularity":88,
//     "release_date":"2019-11-22",
//     "release_date_precision":"day",
//     "total_tracks":21,
//     "tracks":{},
//     "type":"album",
//     "uri":"spotify:album:0tKX7BLXiiRgXUKYdJzjEz"
// }

exports.getAlbums = function(limit=20,search='a', token) {
        return new Promise(function(resolve, reject) {
            let options = {
                url: 'https://api.spotify.com/v1/search?' +
                    'q='+ search +
                    '&type=album' +
                    '&limit=' + limit || "20" ,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };
            request.get(options, function(error, response, body) {
                if (error){
                    return reject(error);
                } else if (response.statusCode === 200){
                    return resolve(body.albums.items);
                }else {
                    return resolve([]);
                }
            });
        });
    }

