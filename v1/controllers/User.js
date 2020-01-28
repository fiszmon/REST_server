'use strict';

let UserService = require('../service/UserService');

module.exports = {
    addUser: async function addUser(req, res, mysql_conn) {
        var login = req.query.login;
        var password = req.query.password;
        await UserService.addUser(mysql_conn, login, password)
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
        let id = req.id;
        var body = req.body;
        await UserService.addUserList(mysql_conn, id, body)
            .then(function (response) {
                res.statusCode = response.status_code;
                res.send(response);
            })
            .catch(function (response) {
                res.statusCode = response.status_code;
                res.send(response);
            });
    },
    destroyUser: async function destroyUser(req, res, mysql_conn) {
        let id = req.id;
        await UserService.destroyUser(id, mysql_conn)
            .then(function (response) {
                res.statusCode = response.status_code;
                res.send(response);
            })
            .catch(function (response) {
                res.statusCode = response.status_code;
                res.send(response);
            });
    },
    getUser: async function getUser(req, res, mysql_conn) {
        let id = req.params.id;
        await UserService.getUser(id, mysql_conn)
            .then(function (response) {
                res.statusCode = response.status_code;
                var data = JSON.stringify(response.data);
                console.log(data);
                res.send(data);
            })
            .catch(function (response) {
                res.statusCode = response.status_code;
                res.send(response.data);
            });
    },
    getUserLists: async function getUserLists(req, res, mysql_conn) {
        let id = req.id;
        let limit = req.limit;
        let offset = req.offset;
        await UserService.getUserLists(id, offset, limit, mysql_conn)
            .then(function (response) {
                res.statusCode = response.status_code;
                res.send(response);
            })
            .catch(function (response) {
                res.statusCode = response.status_code;
                res.send(response);
            });
    },
    getUsers: async function getUsers(req, res, mysql_conn) {
        let limit = req.query.limit;
        let offset = req.query.offset;
        await UserService.getUsers(offset, limit, mysql_conn)
            .then(function (response) {
                res.statusCode = response.status_code;
                console.log("Send: %s \n\n", JSON.stringify(response));
                res.send(response.data);
            })
            .catch(function (response) {
                res.statusCode = response.status_code;
                res.send(response.data);
            });
    },
// loginWithUser: function loginWithUser (req, res, next) {
//   // var name = req.swagger.params['name'].value;
//   // var password = req.swagger.params['password'].value;
//   // User.loginWithUser(name,password)
//   //   .then(function (response) {
//   //     utils.writeJson(res, response);
//   //   })
//   //   .catch(function (response) {
//   //     utils.writeJson(res, response);
//   //   });
// };

    updateUser: async function updateUser(req, res, mysql_conn) {
        var id = req.params.id;
        var name = req.query.name;
        var oldPassword = req.query.oldPassword;
        var newPassword = req.query.newPassword;
        await UserService.updateUser(mysql_conn, id, oldPassword, name, newPassword)
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
