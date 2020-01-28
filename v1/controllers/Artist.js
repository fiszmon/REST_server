'use strict';

const ArtistService = require('../service/ArtistService');

module.exports = {
  getArtist: function getArtist (req, res, token) {
    let id = req.params.id;
      ArtistService.getArtist(id, token)
          .then(function (response) {
            res.statusCode = 200;
            res.send(response);
          })
          .catch(function (response) {
            res.statusCode = 500;
            res.send(response);
          });
  },
  getArtists: function getArtists (req, res, token) {
    let limit = req.params.limit;
    let search = req.params.search;
    ArtistService.getArtists(limit,search, token)
        .then(function (response) {
          res.statusCode = 200;
          res.send(response);
        })
        .catch(function (response) {
          res.statusCode = 500;
          res.send(response);
        });
  }
};
