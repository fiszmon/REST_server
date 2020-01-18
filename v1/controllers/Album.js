'use strict';

import AlbumService from '../service/AlbumService';

class AlbumController  {
  getAlbum(req, res, next) {
    let id = req.params['id'].value;
    Album.getAlbum(id)
        .then(function (response) {
          utils.writeJson(res, response);
        })
        .catch(function (response) {
          utils.writeJson(res, response);
        });
  }
  getAlbums(req, res, next) {
    var limit = req.swagger.params['limit'].value;
    var search = req.swagger.params['search'].value;
    Album.getAlbums(limit,search)
        .then(function (response) {
          utils.writeJson(res, response);
        })
        .catch(function (response) {
          utils.writeJson(res, response);
        });
  }
}

export {
  AlbumController
};
