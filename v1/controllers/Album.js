'use strict';

const AlbumService = require("../service/AlbumService");

module.exports = {
  getAlbum: function getAlbum(req, res, token) {
    let id = req.params.id;
    AlbumService.getAlbum(id, token)
        .then(function (response) {
            res.statusCode = 204;
            console.log("Send: %s \n\n", JSON.stringify(response));
            res.send(response);
        })
        .catch(function (response) {
            res.statusCode = 500;
            res.send(response);
        });
      console.log("Send: %s \n\n"," dupa");
  },
  getAlbums: function getAlbums(req, res, token){
    let limit = req.params.limit;
    let search = req.params.search;
    AlbumService.getAlbums(limit, search, token)
        .then(function (response) {
            res.statusCode = 204;
            // console.log("Send: %s \n\n", JSON.stringify(response));
            res.send(response);
        })
        .catch(function (response) {
            res.statusCode = 500;
            res.send(response);
        });
  }
}


