'use strict';

const request = require("request");

class AlbumService {
    constructor(token, mysql_con) {
        this.dictAlbums = {};
        this.token = token;
        this.mysql = mysql_con;
    }
    getAlbum(id) {
        return new Promise(function(resolve, reject) {
            if (!(id in this.dictAlbums)) {
                this.mysql.query('SELECT * FROM album where ID="${id}"', function (err, result, fields) {
                    if (err) throw err;
                    if(result.length === 0)
                    {
                        let options = {
                            url: "https://api.spotify.com/v1/albums/"+id,
                            headers: {
                                'Authorization': 'Bearer ' + this.token
                            },
                            json: true
                        };
                        request.get(options, function(error, response, body) {
                            if (!error && response.statusCode === 200){
                                // let album = ;
                                // console.log(artists[0].name);
                                // main_res.writeHead(200,
                                //     {"Content-Type": "text/plain"});
                                // main_res.end(main_req.url+" Loaded\n");
                            }

                        });
                    }
                    console.log(result[0]);
                });
                resolve();
            } else {
                resolve(this.dictAlbums[id]);
            }
        });
    }
    getAlbums(limit,search) {
        return new Promise(function(resolve, reject) {
            var examples = {};
            examples['application/json'] = [ {
                "name" : "name",
                "id" : "id"
            }, {
                "name" : "name",
                "id" : "id"
            } ];
            if (Object.keys(examples).length > 0) {
                resolve(examples[Object.keys(examples)[0]]);
            } else {
                resolve();
            }
        });
    }
};
export {
    AlbumService
};

