'use strict';

const request = require("request");
let dictTracks = {};

exports.getTrack = function(id, token) {
  return new Promise(function(resolve, reject) {
    if(!dictTracks)
      dictTracks = {};

    if(!(id in dictTracks)){

      let options = {
        url: "https://api.spotify.com/v1/tracks/"+id,
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
      request.get(options, function(error, response, body) {
        if(error)
          reject(error);
        if (response.statusCode === 200){
          dictTracks[id] = body;
          resolve(body);
        }
        else{
          resolve({});
        }
      });
    }
    else
      resolve(dictTracks[id]);
  });
}

exports.getTracks = function(limit=20,search='a', token) {
  return new Promise(function(resolve, reject) {
    let options = {
      url: 'https://api.spotify.com/v1/search?' +
          'q='+ search +
          '&type=track' +
          '&limit=' + limit || "20" ,
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    request.get(options, function(error, response, body) {
      if (error){
        return reject(error);
      } else if (response.statusCode === 200){
        return resolve(body.tracks.items);
      }else {
        return resolve([]);
      }
    });
  });
}

