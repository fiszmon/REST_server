'use strict';

const AlbumService = require("../service/AlbumService");

module.exports = {
  getAlbum: async function getAlbum(req, res, token) {
    let id = req.params.id;
    await AlbumService.getAlbum(id, token)
        .then(function (response) {
            res.statusCode = 200;
            // console.log("Send: %s \n", JSON.stringify(response));
            res.send(response);
        })
        .catch(function (response) {
            res.statusCode = 500;
            res.send(response);
        });
  },
  getAlbums: async function getAlbums(req, res, token){
    let limit = req.params.limit;
    let search = req.params.search;
    await AlbumService.getAlbums(limit, search, token)
        .then(function (response) {
            res.statusCode = 200;
            res.send(response);
        })
        .catch(function (response) {
            res.statusCode = 500;
            res.send(response);
        });
  }
}


