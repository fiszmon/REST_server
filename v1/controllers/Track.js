'use strict';

const TrackService = require('../service/TrackService');

module.exports = {
  getTrack: function getTrack (req, res, token) {
    let id = req.params.id;
    TrackService.getTrack(id, token)
        .then(function (response) {
          res.statusCode = 200;
          res.send(response);
        })
        .catch(function (response) {
          res.statusCode = 500;
          res.send(response);
        });
  },
  getTracks: function getTracks (req, res, token) {
    let limit = req.params.limit;
    let search = req.params.search;
    TrackService.getTracks(limit, search, token)
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
