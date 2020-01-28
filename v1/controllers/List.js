'use strict';

var utils = require('../utils/writer.js');
var List = require('../service/ListService');

module.exports.addTrackToList = function addTrackToList (req, res, next) {
  var lid = req.swagger.params['lid'].value;
  var tid = req.swagger.params['tid'].value;
  List.addTrackToList(lid,tid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.addUserList = function addUserList (req, res, next) {
  var id = req.swagger.params['id'].value;
  var body = req.swagger.params['body'].value;
  List.addUserList(id,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteTrackFromList = function deleteTrackFromList (req, res, next) {
  var lid = req.swagger.params['lid'].value;
  var tid = req.swagger.params['tid'].value;
  List.deleteTrackFromList(lid,tid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.destroyList = function destroyList (req, res, next) {
  var id = req.swagger.params['id'].value;
  List.destroyList(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getList = function getList (req, res, next) {
  var id = req.swagger.params['id'].value;
  List.getList(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getListTracks = function getListTracks (req, res, next) {
  var id = req.swagger.params['id'].value;
  var limit = req.swagger.params['limit'].value;
  List.getListTracks(id,limit)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.shareListWithUser = function shareListWithUser (req, res, next) {
  var lid = req.swagger.params['lid'].value;
  var uid = req.swagger.params['uid'].value;
  List.shareListWithUser(lid,uid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.unshareListWithUser = function unshareListWithUser (req, res, next) {
  var lid = req.swagger.params['lid'].value;
  var uid = req.swagger.params['uid'].value;
  List.unshareListWithUser(lid,uid)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.updateList = function updateList (req, res, next) {
  var id = req.swagger.params['id'].value;
  var body = req.swagger.params['body'].value;
  List.updateList(id,body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
