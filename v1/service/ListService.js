'use strict';

const listModel = require("../models/ListModel");
const request = require("request");

exports.addTrackToList = async function(mysql_conn, token, uid, lid, tid) {
  let [condition, resError] = await checkIfListExists(mysql_conn, lid);
  if (!condition) throw resError;

  [condition, resError] = await checkPermissionToUpdateList(mysql_conn, uid, lid);
  if (!condition) throw resError;

  const [good, res] = await spotifyDbGetTrack(token, tid);
  if (!good) throw res;

  let track = res;

  let query = `SELECT MAX(PLAY_ORDER) AS LAST FROM list_${lid};`;
  let [err, result] = await queryDb(mysql_conn, query);
  if (err) throw { type: 'database_err', data: err, status_code: 500 };

  query = `INSERT INTO list_${lid} (TRACK_ID, NAME, PLAY_ORDER) VALUES ('${tid}', '${track.name}', ${result[0].LAST + 1});`;
  let [err1, result1] = await queryDb(mysql_conn, query);
  if (err1) throw { type: 'database_err', data: err, status_code: 500 };

  const [created, list] = await getListFromDatabase(mysql_conn, lid);
  if(!created)
    throw list;

  return {
    type: 'success',
    data: list,
    status_code: 200
  };

}

exports.deleteTrackFromList = async function(mysql_conn, uid, lid, tid) {
  let [condition, resError] = await checkIfListExists(mysql_conn, lid);
  if (!condition) throw resError;

  [condition, resError] = await checkPermissionToUpdateList(mysql_conn, uid, lid);
  if (!condition) throw resError;

  let query = `DELETE FROM list_${lid} WHERE ID=${tid}`;
  let [err, result] = await queryDb(mysql_conn, query);
  if (err) throw { type: 'database_err', data: err, status_code: 500 };

  const [created, list] = await getListFromDatabase(mysql_conn, lid);
  if(!created)
    throw list;

  return {
    type: 'success',
    data: list,
    status_code: 200
  };
}

exports.destroyList = async function(mysql_conn, uid, id) {
  let [condition, resError] = await checkIfListExists(mysql_conn, id);
  if (!condition) throw resError;
  [condition, resError] = await checkPermissionToUpdateList(mysql_conn, uid, id);
  if (!condition) throw resError;

  let query = `DELETE FROM list WHERE ID=${id}`;
  let [err, result] = await queryDb(mysql_conn, query);
  if (err) throw { type: 'database_err', data: err, status_code: 500 };

  query = `DROP TABLE list_${id}`;
  [err, result] = await queryDb(mysql_conn, query);
  if (err) throw { type: 'database_err', data: err, status_code: 500 };

  query = `DROP TABLE user_share_list_${id}`;
  [err, result] = await queryDb(mysql_conn, query);
  if (err) throw { type: 'database_err', data: err, status_code: 500 };

  return {
    type: 'success',
    data: undefined,
    status_code: 204
  };

}

exports.getList = async function(uid, id, mysql_conn) {
  let [condition, resError] = await checkIfListExists(mysql_conn, id);
  if (!condition) throw resError;

  [condition, resError] = await checkPermissionToUpdateList(mysql_conn, uid, id);
  if (!condition && resError.type == "database_err") throw resError;
  else if(!condition){
    [condition, resError] = await checkIsSharedWith(mysql_conn, uid, id);
    if (!condition) throw resError;
  }

  const [created, list] = await getListFromDatabase(mysql_conn, id);
  if(!created)
    throw list;

  return {
    type: 'success',
    data: list,
    status_code: 200
  };
}

exports.getListTracks = async function(mysql_conn, token, uid, id, limit=20, offset=0) {
  let [condition, resError] = await checkIfListExists(mysql_conn, id);
  if (!condition) throw resError;

  [condition, resError] = await checkPermissionToUpdateList(mysql_conn, uid, id);
  if (!condition && resError.type == "database_err") throw resError;
  else if(!condition){
    [condition, resError] = await checkIsSharedWith(mysql_conn, uid, id);
    if (!condition) throw resError;
  }

  const [created, list] = await getListFromDatabase(mysql_conn, id);
  if(!created)
    throw list;

  let length = (list.tracks.length>parseInt(limit)+parseInt(offset))?parseInt(limit)+parseInt(offset):list.tracks.length;
  let tid = "";
  for(var i=offset;i<length;i++){
    tid+=list.tracks[i].spotify_id;
    if(i<length - 1)
      tid+=',';
  }
  let tracks = [];
  if(tid.length> 0) {
    const [good, res] = await spotifyDbGetTrack(token, tid, true);
    if (!good) throw res;
    tracks = res.tracks;
  }

  return {
    type: 'success',
    data: tracks,
    status_code: 200
  };

}

exports.shareListWithUser = async function(mysql_conn, uid, lid, sid) {
  let [exists, existsError] = await checkIfUserExists(mysql_conn, sid);
  if (!exists) throw existsError;

  let [condition, resError] = await checkIfListExists(mysql_conn, lid);
  if (!condition) throw resError;

  [condition, resError] = await checkPermissionToUpdateList(mysql_conn, uid, lid);
  if (!condition) throw resError;

  [condition, resError] = await checkIfNotContainsUser(mysql_conn, lid, sid);
  if (!condition) throw resError;

  let query = `INSERT INTO user_share_list_${lid} (USER_ID) VALUES (${sid})`;
  let [err, result] = await queryDb(mysql_conn, query);
  if (err) throw { type: 'database_err', data: err, status_code: 500 };

  const [created, list] = await getListFromDatabase(mysql_conn, lid);
  if(!created)
    throw list;

  return {
    type: 'success',
    data: list,
    status_code: 201
  };
}

exports.unshareListWithUser = async function(mysql_conn, uid, lid, sid) {
  let [condition, resError] = await checkIfListExists(mysql_conn, lid);
  if (!condition) throw resError;

  [condition, resError] = await checkPermissionToUpdateList(mysql_conn, uid, lid);
  if (!condition) throw resError;

  // [condition, resError] = await checkIsSharedWith(mysql_conn, sid, lid);
  // if (!condition && resError.type == "database_err") throw resError;

  let query = `DELETE FROM user_share_list_${lid} WHERE USER_ID = ${sid}`;
  let [err, result] = await queryDb(mysql_conn, query);
  if (err) throw { type: 'database_err', data: err, status_code: 500 };

  const [created, list] = await getListFromDatabase(mysql_conn, lid);
  if(!created)
    throw list;

  return {
    type: 'success',
    data: list,
    status_code: 201
  };
}

exports.addUserList = async function(mysql_conn, id,body) {
  if (!body || !body.name || !body.tracks || !body.sharedWith || !id)
    throw { type: 'list_err', data: 'Missing arguments', status_code: 400 };

  let [exists, existsError] = await checkIfUserExists(mysql_conn, id);
  if (!exists) throw existsError;

  [exists, existsError] = await checkIfListNameExists(mysql_conn, body.name);
  if (!exists) throw existsError;

  let query = `INSERT INTO list (NAME, OWNER) VALUES ('${body.name}', ${id});`;
  let [err, result] = await queryDb(mysql_conn, query);
  if (err) throw { type: 'database_err', data: err, status_code: 500 };

  let listId = result.insertId;
  query = `CREATE TABLE list_${listId} (ID BIGINT(64) AUTO_INCREMENT PRIMARY KEY, TRACK_ID VARCHAR(64), NAME VARCHAR(100), PLAY_ORDER INT);`;
  [err, result] = await queryDb(mysql_conn, query);
  if (err) throw { type: 'database_err', data: err, status_code: 500 };

  query = `CREATE TABLE user_share_list_${listId} (USER_ID BIGINT(20) PRIMARY KEY);`;
  [err, result] = await queryDb(mysql_conn, query);
  if (err) throw { type: 'database_err', data: err, status_code: 500 };

  query = `INSERT INTO user_list (USER_ID, LIST_ID) VALUES (${id}, ${listId});`;
  [err, result] = await queryDb(mysql_conn, query);
  if (err) throw { type: 'database_err', data: err, status_code: 500 };

  if(body.tracks.length>0){
    [err, result] = await insertAllTracks(mysql_conn, body.tracks, listId);
    if (!err) throw result;
  }

  if(body.sharedWith.length>0){
    [err, result] = await insertAllSharedUsers(mysql_conn, body.sharedWith, listId);
    if (!err) throw result;
  }

  return {
    type: 'success',
    data: new listModel.List(listId, body.name, body.tracks, body.owner, body.sharedWith),
    status_code: 201
  };
}

exports.updateList = async function(mysql_conn, uid, id,body) {
  if (!body || !body.name || !body.tracks || !body.sharedWith || !id || !uid)
    throw { type: 'list_err', data: 'Missing arguments', status_code: 400 };

  let [condition, resError] = await checkIfListExists(mysql_conn, id);
  if (!condition) throw resError;

  [condition, resError] = await checkPermissionToUpdateList(mysql_conn, uid, id);
  if (!condition) throw resError;

  [condition, resError] = await checkIfListNameExists(mysql_conn, body.name, id);
  if (!condition) throw resError;

  let query = `UPDATE list SET NAME='${body.name}' WHERE ID=${id};`;
  let [err, result] = await queryDb(mysql_conn, query);
  if (err) throw { type: 'database_err', data: err, status_code: 500 };

  if(body.tracks.length>0){
    [err, result] = await insertAllTracks(mysql_conn, body.tracks, id, true);
    if (!err) throw result;
  }

  if(body.sharedWith.length>0){
    [err, result] = await insertAllSharedUsers(mysql_conn, body.sharedWith, id, true);
    if (!err) throw result;
  }

  const [created, list] = await getListFromDatabase(mysql_conn, id);
  if(!created)
    throw list;

  return {
    type: 'success',
    data: list,
    status_code: 200
  };

}

/**
 *
 * id Long
 * limit Integer Limit of returned items (optional)
 * returns List
 **/
exports.getUserLists = function(id,offset=0, limit=20, mysql_conn) {
  return new Promise(async function(resolve, reject) {
    let query = `SELECT * FROM list WHERE OWNER = ${id} LIMIT ${limit} OFFSET ${offset}`;
    await mysql_conn.query(query, function (err, result) {
      if (err)
        return reject({type: "database_err", data: err, status_code: 500});
      else{
        if(limit>result.length) limit = result.length;
        let list = [];
        for(let i=0;i<limit;i++)
          list.push(new listModel.ShortList(result[i].ID, result[i].NAME));
        return resolve({type:"success", data: list, status_code: 200});
      }
    });
  });
}


async function checkIfListNameExists(DbConnection, name, id = -1) {
  let queryWhere = id !== -1 ? ` AND NOT ID=${id};` : ';';
  let query = `SELECT * FROM list WHERE NAME ='${name}'${queryWhere}`;

  const [err, result] = await queryDb(DbConnection, query);

  if (err) return [false, { type: 'database_err', data: err, status_code: 500 }];

  if (result.length > 0) return [false, { type: 'list_exists', data: 'List name exists in database', status_code: 409 }];

  return [true, {}];
}

async function checkIfListExists(DbConnection, id){
  let query = `SELECT NAME FROM list WHERE ID = ${id}`;

  const [err, result] = await queryDb(DbConnection, query);

  if (err) return [false, { type: 'database_err', data: err, status_code: 500 }];

  if (result.length === 0)
    return [false, { type: 'list_not_exists', data: 'List with specified id not exists', status_code: 404 }];

  return [true, {}];
}

async function checkIfNotContainsUser(DbConnection, lid, uid){
  let query = `SELECT USER_ID FROM user_share_list_${lid} WHERE USER_ID = ${uid}`;

  const [err, result] = await queryDb(DbConnection, query);

  if (err) return [false, { type: 'database_err', data: err, status_code: 500 }];

  if (result.length > 0)
    return [false, { type: 'user_exists', data: 'Already shared', status_code: 409 }];

  return [true, {}];
}

async function checkPermissionToUpdateList(DbConnection, uid, id){
  let query = `SELECT ID FROM list WHERE ID = ${id} AND OWNER = ${uid}`;

  const [err, result] = await queryDb(DbConnection, query);

  if (err) return [false, { type: 'database_err', data: err, status_code: 500 }];

  if (result.length === 0)
    return [false, { type: 'list_err', data: 'You do not own this list', status_code: 403 }];

  return [true, {}];
}

async function checkIsSharedWith(DbConnection, uid, id){
  let query = `SELECT USER_ID FROM user_share_list_${id} WHERE USER_ID = ${uid}`;

  const [err, result] = await queryDb(DbConnection, query);

  if (err) return [false, { type: 'database_err', data: err, status_code: 500 }];

  if (result.length === 0)
    return [false, { type: 'list_err', data: 'List is not shared with you', status_code: 403 }];

  return [true, {}];
}

async function checkIfUserExists(DbConnection, id){
  let query = `SELECT LOGIN FROM user WHERE ID = ${id}`;

  const [err, result] = await queryDb(DbConnection, query);

  if (err) return [false, { type: 'database_err', data: err, status_code: 500 }];

  if (result.length === 0)
    return [false, { type: 'user_not_exists', data: 'User with specified id not exists', status_code: 404 }];

  return [true, {}];
}

async function insertAllTracks(DbConnection, tracks, lid, clear_list = false) {
  if(clear_list){
    let query =`TRUNCATE list_${lid};`;
    let [err, result] = await queryDb(DbConnection, query);
    if (err) return [false, { type: 'database_err', data: err, status_code: 500 }];
  }
  let query =`INSERT INTO list_${lid} (TRACK_ID, NAME, PLAY_ORDER) VALUES ?;`;
  let values = []
  for(let i=0; i<tracks.length;i++)
    values.push([tracks[i].id,tracks[i].name,i]);
  let [err, result] = await queryDb(DbConnection, query, values);
  if (err) return [false, { type: 'database_err', data: err, status_code: 500 }];

  return [true, {}];
}

async function getListFromDatabase(DbConnection, lid, short = false) {
  let lMod = (short?new listModel.ShortList(lid):new listModel.List(lid));
  let query =`SELECT * FROM list WHERE ID = ${lid};`;
  let [err, result] = await queryDb(DbConnection, query);
  if (err) return [false, { type: 'database_err', data: err, status_code: 500 }];

  lMod.owner = result[0].OWNER;
  lMod.name = result[0].NAME;

  if(!short) {
    query = `SELECT * FROM list_${lid}`;
    [err, result] = await queryDb(DbConnection, query);
    if (err) return [false, {type: 'database_err', data: err, status_code: 500}];

    if (result.length > 0) {
      for (let i = 0; i < result.length; i++)
        lMod.tracks.push({id: result[i].ID, spotify_id: result[i].TRACK_ID, name: result[i].NAME});
    }

    query = `SELECT * FROM user_share_list_${lid}`;
    [err, result] = await queryDb(DbConnection, query);
    if (err) return [false, {type: 'database_err', data: err, status_code: 500}];

    if (result.length > 0) {
      for (let i = 0; i < result.length; i++)
        lMod.sharedWith.push(result[i].USER_ID);
    }
  }
  return [true, lMod];
}

async function insertAllSharedUsers(DbConnection, sharedWith, lid, clear_list = false) {
  if(clear_list){
    let query =`TRUNCATE user_share_list_${lid};`;
    let [err, result] = await queryDb(DbConnection, query);
    if (err) return [false, { type: 'database_err', data: err, status_code: 500 }];
  }
  let query = `INSERT INTO user_share_list_${lid} (USER_ID) VALUES ?`;
  let values = [];
  for(let i=0;i<sharedWith.length;i++)
    values.push([sharedWith[i]]);
  let [err, result] = await queryDb(DbConnection, query, values);
  if (err) return [false, { type: 'database_err', data: err, status_code: 500 }];
  return [true, {}];
}

function queryDb(DbConnection, query, values=undefined) {
  return new Promise((resolve, reject) => {
    if(values==undefined)
      DbConnection.query(query, (err, result) => resolve([err, result]));
    else
      DbConnection.query(query, [values], (err, result) => resolve([err, result]));
  });
}

function spotifyDbGetTrack(token, tid, several=false) {
  return new Promise((resolve, reject) => {
    let options = {
      url: "https://api.spotify.com/v1/tracks"+(several?'?ids='+tid:'/'+tid),
      headers: {
        'Authorization': 'Bearer ' + token
      },
      json: true
    };
    request.get(options, (error, response, body) => {
      if(error)
        reject([false, error]);
      if (response.statusCode === 200){
        resolve([true, body]);
      }
    });
  });
}