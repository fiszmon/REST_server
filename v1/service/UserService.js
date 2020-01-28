'use strict';

const PasswordHashService = require("password-hash");
const userModels = require("../models/UserModel");
const listModel = require("../models/ListModel");

/**
 *
 * login String Name of new user
 * password String Password for new user
 * returns short-user
 **/
let dictUsers = {}, dictShortUsers = {};

exports.addUser = function(mysql_conn, login,password) {
  return new Promise(function(resolve, reject) {
    let user = {}
    //============== check if user exists
    CheckIfLoginExists(mysql_conn, login, -1, function (exists) {
      if(!exists[0])
        reject(exists[1]);
      else{
        //============== create user
        let query = `INSERT INTO user (LOGIN, PASSWORD, TOKEN) VALUES ('${login}', '${PasswordHashService.generate(password)}', '""')`;
        mysql_conn.query(query, function (err, result) {
          if (err)
            reject({type: "database_err", data: err, status_code: 500});
          else{
            let userId = result.insertId;
            console.log("user added\n");
            resolve({type: "success", data: new userModels.ShortUser(userId, login), status_code: 204});
          }
        });
      }
    });
  });
}

exports.addUserList = function(mysql_conn, id,body) {
  return new Promise(function(resolve, reject) {
    let query = `SELECT * FROM list WHERE NAME = ${body.name}`;
    mysql_conn.query(query, function (err, result) {
      if (err)
        return reject({type: "database_err", data: err, status_code: 500});
      else{
        if(result.length > 0)
          return reject({type: "list_exists", data: "This name exist in your lists", status_code: 409});

        query = `INSERT INTO list (NAME, OWNER) VALUES ('${body.name}', ${id});`;
        mysql_conn.query(query, function (err, result) {
          if (err)
            return reject({type: "database_err", data: err, status_code: 500});
          else{
            let listId = result.insertId;

            query = `CREATE TABLE list_${listId} (TRACK_ID VARCHAR(64) PRIMARY KEY, NAME VARCHAR(100), PLAY_ORDER INT);
                    CREATE TABLE user_list_${listId} (USER_ID BIGINT(20) PRIMARY KEY);
                    INSERT INTO list_${listId} (TRACK_ID, NAME, PLAY_ORDER) VALUES ?`;

            let values = [];
            for(let i=0;i<body.tracks.length;i++){
              values.push([body.tracks[i].id,body.tracks[i].name,i]);
            }

            mysql_conn.query(query, values, function (err, result) {
              if (err)
                return reject({type: "database_err", data: err, status_code: 500});
              else{
                query = `INSERT INTO user_list_${listId} (USER_ID) VALUES ?`;
                let values = [];
                for(let i=0;i<body.tracks.length;i++){
                  values.push([body.sharedWith[i]]);
                }
                mysql_conn.query(query, values, function (err, result) {
                  if (err)
                    return reject({type: "database_err", data: err, status_code: 500});
                  else{
                    resolve({type:"success",
                      data: new listModel(listId, body.name, body.tracks, body.owner, body.sharedWith),
                      status_code: 200});
                  }
                });
              }
            });
          }
        });
      }
    });
  });
}


/**
 *
 * id Long 
 * no response value expected for this operation
 **/
exports.destroyUser = function(id, mysql_conn) {
  return new Promise(function(resolve, reject) {
    let query = `DELETE FROM user WHERE ID = ${id}`;
    mysql_conn.query(query, function (err, result) {
      if (err)
        return reject({type: "database_err", data: err, status_code: 500});
      else{
        return resolve({type:"success", data: `User with id ${id} deleted`, status_code: 204});
      }
    });
  });
}


/**
 *
 * id Long 
 * returns user
 **/
exports.getUser = function(id, mysql_conn) {
  return new Promise(function(resolve, reject) {
    let query = `SELECT * FROM user WHERE ID = ${id}`;
    mysql_conn.query(query, function (err, result) {
      if (err)
        reject({type: "database_err", data: err, status_code: 500});
      else{
        resolve({type:"success", data: new userModels.User(result.id, result.name, result.token), status_code: 204});
      }
    });
  });
}


/**
 *
 * id Long 
 * limit Integer Limit of returned items (optional)
 * returns List
 **/
exports.getUserLists = function(id,offset=0, limit=20, mysql_conn) {
  return new Promise(function(resolve, reject) {
    let query = `SELECT * FROM list WHERE OWNER = ${id} LIMIT ${limit}, ${offset}`;
    mysql_conn.query(query, function (err, result) {
      if (err)
        return reject({type: "database_err", data: err, status_code: 500});
      else{
        if(limit>result.length) limit = result.length;
        let list = [];
        for(let i=0;i<limit;i++)
          list.push(new listModel.ShortList(result.id, result.name));
        return resolve({type:"success", data: list, status_code: 204});
      }
    });
  });
}


/**
 *
 * limit Integer Limit of returned items (optional)
 * returns List
 **/
exports.getUsers = function(offset=0, limit=20, mysql_conn) {
  return new Promise(function(resolve, reject) {
    let query = `SELECT * FROM user LIMIT ${limit} OFFSET ${offset}`;
    mysql_conn.query(query, function (err, result) {
      if (err)
        return reject({type: "database_err", data: err, status_code: 500});
      else{
        if(limit>result.length) limit = result.length;
        let users = {items:[]};
        for(let i=0;i<limit;i++)
          users.items.push(new userModels.ShortUser(result[i].ID, result[i].LOGIN));
        return resolve({type:"success", data: users, status_code: 204});
      }
    });
  });
}


/**
 *
 * name String 
 * password String encoded password
 * returns user
 **/
exports.loginWithUser = function(name,password) {
  return new Promise(function(resolve, reject) {
    //======================= todo
    resolve({});
  });
}

/**
 *
 * id Long 
 * name String new name (optional)
 * password String new password (optional)
 * returns user
 **/
exports.updateUser = function(mysql_conn, id,oldPassword="",name="", newPassword="") {
  return new Promise(function(resolve, reject) {
    let exists = CheckIfLoginExists(mysql_conn, name, id);
    if(!exists[0])
      return reject(exists[1]);

    let passwd = CheckIsCorrectPassword(mysql_conn, oldPassword);
    if(!passwd[0])
        return reject(passwd[1]);

    let query = `UPDATE user SET `;
    if(!(name===""&&newPassword==="")){
      query+=`PASSWORD=${PasswordHashService.generate(newPassword)} ` +
        `LOGIN=${name} `;
    }else if(name===""&&newPassword===""){
       return reject({type: "user_err", data: "Empty arguments", status_code: 400});
    }else if(!(name==="")){
      query+= `LOGIN=${name} `;
    }else if (newPassword===""){
      query+=`PASSWORD=${PasswordHashService.generate(newPassword)} `;
    }
    query+=`WHERE ID=${id}`;
    mysql_conn.query(query, function (err, result) {
      if (err)
        return reject({type: "database_err", data: err, status_code: 500});
      else{
        query = `SELECT * FROM user WHERE ID=${id}`;
        mysql_conn.query(query, function (err, result) {
          if (err)
            return reject({type: "database_err", data: err, status_code: 500});
          else{
            console.log("user added\n");
            return resolve({type: "success", data: new userModels.ShortUser(id, result.name), status_code: 204});
          }
        });
      }
    });
  });
}

function CheckIfLoginExists(mysql_conn,name, id=-1, callback) {
  let query = `SELECT * FROM user WHERE LOGIN ='${name}'` + (id!=-1?` AND NOT ID=${id};`:';');
  var r =mysql_conn.query(query, function (err, result) {
    if (err)
      callback( [false, {type: "database_err", data: err, status_code: 500}]);
    else {
      if (result.length > 0)
        callback([false, {type: "user_exists", data: "Login exists in database", status_code: 409}]);
      else
        callback([true, {}]);
    }
  });
}

function CheckIsCorrectPassword(mysql_conn, id, password, callback) {
  let query = `SELECT PASSWORD FROM user WHERE ID = ${id}`;

  mysql_conn.query(query, function (err, result) {
    if (err)
      callback( [false, {type: "database_err", data: err, status_code: 500}]);
    else {
      if (result.length === 0)
        callback(false, {type: "user_not_exists", data: "User with specified id not exists", status_code: 404});
      if(PasswordHashService.verify(password, result.password))
        callback( [true, {}]);
      else
        callback (false, {type: "wrong_password", data: "Wrong password", status_code: 400});
    }
  });
}