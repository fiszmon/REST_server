'use strict';

const TrackService = require('../service/TrackService');

module.exports = {
  getTrack: async function getTrack (req, res, token) {
    let id = req.params.id;
    await TrackService.getTrack(id, token)
        .then(function (response) {
          res.statusCode = 200;
          res.send(response);
        })
        .catch(function (response) {
          res.statusCode = 500;
          res.send(response);
        });
  },
  getTracks: async function getTracks (req, res, token) {
    let limit = req.params.limit;
    let search = req.params.search;
    await TrackService.getTracks(limit, search, token)
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
