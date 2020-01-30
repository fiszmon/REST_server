'use strict';

const request = require("request");
let dictArtists = {};

exports.getArtist = function(id) {
  return new Promise(function(resolve, reject, token) {
      if(!dictArtists)
          dictArtists = {};
      if(!(id in dictArtists)){
          let options = {
              url: "https://api.spotify.com/v1/artists/"+id,
              headers: {
                  'Authorization': 'Bearer ' + token
              },
              json: true
          };
          request.get(options, function(error, response, body) {
              if(error)
                  reject(error);
              if (response.statusCode === 200){
                  dictArtists[id] = body;
                  resolve(body);
              }
              else{
                  resolve({});
              }
          });
      }
      else
          resolve(dictArtists[id]);
  });
};
exports.getArtists = function(limit=20,search='a', token) {
    return new Promise(function(resolve, reject) {
    let options = {
        url: 'https://api.spotify.com/v1/search?' +
          'q='+ search +
          '&type=artist' +
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
          return resolve(body.artists.items);
      }else {
          return resolve([]);
      }
    });
    });
};

