'use strict';

const ArtistService = require('../service/ArtistService');

module.exports = {
  getArtist: async function getArtist (req, res, token) {
    let id = req.params.id;
    await ArtistService.getArtist(id, token)
          .then(function (response) {
            res.statusCode = 200;
            res.send(response);
          })
          .catch(function (response) {
            res.statusCode = 500;
            res.send(response);
          });
  },
  getArtists: async function getArtists (req, res, token) {
    let limit = req.params.limit;
    let search = req.params.search;
    await ArtistService.getArtists(limit,search, token)
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
