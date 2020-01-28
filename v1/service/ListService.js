'use strict';

exports.addTrackToList = function(lid,tid) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

exports.deleteTrackFromList = function(lid,tid) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

exports.destroyList = function(id) {
  return new Promise(function(resolve, reject) {
    resolve();
  });
}

exports.getList = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "owner" : "",
  "name" : "name",
  "id" : "id",
  "sharedWith" : [ "", "" ],
  "tracks" : [ {
    "name" : "",
    "id" : ""
  }, {
    "name" : "",
    "id" : ""
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

exports.getListTracks = function(id,limit) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

exports.getUserLists = function(id,limit) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "name" : "",
  "id" : ""
}, {
  "name" : "",
  "id" : ""
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

exports.shareListWithUser = function(lid,uid) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

exports.unshareListWithUser = function(lid,uid) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = "";
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

exports.updateList = function(id,body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "owner" : "",
  "name" : "name",
  "id" : "id",
  "sharedWith" : [ "", "" ],
  "tracks" : [ {
    "name" : "",
    "id" : ""
  }, {
    "name" : "",
    "id" : ""
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

