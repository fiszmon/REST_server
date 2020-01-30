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
  return new Promise(async function(resolve, reject) {
    let user = {}
    //============== check if user exists
    let [exists, existsError] = await checkIfLoginExists(mysql_conn, login);
    if (!exists) throw existsError;
    //============== create user
    let query = `INSERT INTO user (LOGIN, PASSWORD, TOKEN) VALUES ('${login}', '${PasswordHashService.generate(password)}', '')`;
    await mysql_conn.query(query, function (err, result) {
      if (err)
        reject({type: "database_err", data: err, status_code: 500});
      else{
        let userId = result.insertId;
        resolve({type: "success", data: new userModels.ShortUser(userId, login), status_code: 201});
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
exports.getUser = function(id = -1, mysql_conn) {
  return new Promise(function(resolve, reject) {
    let query = `SELECT * FROM user WHERE ID = ` + id;
    mysql_conn.query(query, function (err, result) {
      if (err) {
        return reject({type: "database_err", data: err, status_code: 500});
      }else{
        if(result.length == 0)
          return reject({type:"fail", data: "User not found", status_code: 404})

        return resolve({type:"success", data: new userModels.User(result[0].ID, result[0].LOGIN, result[0].TOKEN), status_code: 200});
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
        return resolve({type:"success", data: users, status_code: 200});
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
exports.updateUser = async function(mysql_conn, id,oldPassword="",name="", newPassword="") {
  if (!oldPassword) throw { type: 'user_err', data: 'Empty arguments', status_code: 400 };
  if(newPassword===""&&name==="") throw { type: 'success', data: 'Nothing to update', status_code: 200 };
  let [not_exists, not_existsError] = await checkIfUserExists(mysql_conn, id);

  if (!not_exists) throw not_existsError;

  let [exists, existsError] = await checkIfLoginExists(mysql_conn, name, id);

  if (!exists) throw existsError;

  let [isCorrect, passwordError] = await checkIsCorrectPassword(mysql_conn, id, oldPassword);

  if (!isCorrect) throw passwordError;

  let query = `UPDATE user SET `;
  if (name !== '') {
    query += `LOGIN='${name}' `;
  } else if (newPassword !== '') {
    query += `PASSWORD='${PasswordHashService.generate(newPassword)}' `;
  }
  query += `WHERE ID=${id}`;

  let [err, result] = await queryDb(mysql_conn, query);

  if (err) throw { type: 'database_err', data: err, status_code: 500 };

  query = `SELECT * FROM user WHERE ID=${id}`;

  [err, result] = await queryDb(mysql_conn, query);

  if (err) throw { type: 'database_err', data: err, status_code: 500 };

  return {
    type: 'success',
    data: new userModels.ShortUser(id, result[0].LOGIN),
    status_code: 200
  };
};

async function checkIfLoginExists(DbConnection, name, id = -1) {
  let queryWhere = id !== -1 ? ` AND NOT ID=${id};` : ';';
  let query = `SELECT * FROM user WHERE LOGIN ='${name}'${queryWhere}`;

  const [err, result] = await queryDb(DbConnection, query);

  if (err) return [false, { type: 'database_err', data: err, status_code: 500 }];

  if (result.length > 0) return [false, { type: 'user_exists', data: 'Login exists in database', status_code: 409 }];

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

async function checkIsCorrectPassword(DbConnection, id, password) {
  let query = `SELECT PASSWORD FROM user WHERE ID = ${id}`;

  const [err, result] = await queryDb(DbConnection, query);

  if (err) return [false, { type: 'database_err', data: err, status_code: 500 }];

  if (result.length === 0)
    return [false, { type: 'user_not_exists', data: 'User with specified id not exists', status_code: 404 }];

  if (!PasswordHashService.verify(password, result[0].PASSWORD))
    return [false, { type: 'wrong_password', data: 'Wrong password', status_code: 400 }];

  return [true, {}];
}

function queryDb(DbConnection, query) {
  return new Promise((resolve, reject) => {
    DbConnection.query(query, (err, result) => resolve([err, result]));
  });
}