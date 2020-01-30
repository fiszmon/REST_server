'use strict';

var ListService = require('../service/ListService');

module.exports = {
  addTrackToList: async function addTrackToList(req, res, mysql_conn, token) {
    var lid = req.params.lid;
    var uid = req.params.uid;
    var tid = req.params.tid;
    await ListService.addTrackToList(mysql_conn, token, uid, lid, tid)
        .then(function (response) {
            res.statusCode = response.status_code;
            res.send(response.data);
        })
        .catch(function (response) {
            res.statusCode = response.status_code;
            res.send(response.data);
        });
  },
  addUserList: async function addUserList(req, res, mysql_conn) {
    let id = req.params.id;
    let body = req.body;
    await ListService.addUserList(mysql_conn, id, body)
        .then(function (response) {
            res.statusCode = response.status_code;
            res.send(response.data);
        })
        .catch(function (response) {
            res.statusCode = response.status_code;
            res.send(response.data);
        });
  },
    getUserLists: async function getUserLists(req, res, mysql_conn) {
        let id = req.params.id;
        let limit = req.query.limit;
        let offset = req.query.offset;
        await ListService.getUserLists(id, offset, limit, mysql_conn)
            .then(function (response) {
                res.statusCode = response.status_code;
                res.send(response.data);
            })
            .catch(function (response) {
                res.statusCode = response.status_code;
                res.send(response.data);
            });
    },
  deleteTrackFromList: async function deleteTrackFromList(req, res, mysql_conn) {
      var lid = req.params.lid;
      var uid = req.params.uid;
      var tid = req.params.tid;
    await ListService.deleteTrackFromList(mysql_conn, uid, lid, tid)
        .then(function (response) {
            res.statusCode = response.status_code;
            res.send(response.data);
        })
        .catch(function (response) {
            res.statusCode = response.status_code;
            res.send(response.data);
        });
  },
  destroyList: async function destroyList(req, res, mysql_conn) {
    var id = req.params.id;
    var uid = req.params.uid;
    await ListService.destroyList(mysql_conn, uid, id)
        .then(function (response) {
            res.statusCode = response.status_code;
            res.send('');
        })
        .catch(function (response) {
            res.statusCode = response.status_code;
            res.send(response.data);
        });
  },
  getList: async function getList(req, res, mysql_conn) {
    var id = req.params.id;
    var uid = req.params.uid;
    await ListService.getList(uid, id, mysql_conn)
        .then(function (response) {
            res.statusCode = response.status_code;
            res.send(response.data);
        })
        .catch(function (response) {
            res.statusCode = response.status_code;
            res.send(response.data);
        });
  },
  getListTracks: async function getListTracks(req, res, mysql_conn, token) {
      var id = req.params.lid;
      var uid = req.params.uid;
      var limit = req.query.limit;
      var offset = req.query.offset;
    await ListService.getListTracks(mysql_conn, token, uid, id, limit, offset)
        .then(function (response) {
            res.statusCode = response.status_code;
            res.send(response.data);
        })
        .catch(function (response) {
            res.statusCode = response.status_code;
            res.send(response.data);
        });
  },
  shareListWithUser: async function shareListWithUser(req, res, mysql_conn) {
      var lid = req.params.lid;
      var uid = req.params.uid;
      var sid = req.params.sid;
    await ListService.shareListWithUser(mysql_conn, uid, lid, sid)
        .then(function (response) {
            res.statusCode = response.status_code;
            res.send(response.data);
        })
        .catch(function (response) {
            res.statusCode = response.status_code;
            res.send(response.data);
        });
  },
  unshareListWithUser: async function unshareListWithUser(req, res, mysql_conn) {
      var lid = req.params.lid;
      var uid = req.params.uid;
      var sid = req.params.sid;
      await ListService.unshareListWithUser(mysql_conn, uid, lid, sid)
          .then(function (response) {
              res.statusCode = response.status_code;
              res.send(response.data);
          })
          .catch(function (response) {
              res.statusCode = response.status_code;
              res.send(response.data);
          });
  },
  updateList: async function updateList(req, res, mysql_con) {
    var id = req.params.id;
    var uid = req.params.uid;
    var body = req.body;
    await ListService.updateList(mysql_con, uid, id, body)
        .then(function (response) {
            res.statusCode = response.status_code;
            res.send(response.data);
        })
        .catch(function (response) {
            res.statusCode = response.status_code;
            res.send(response.data);
        });
  }
}