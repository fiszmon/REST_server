'use strict';

function UserModel(id, name, token) {
        this.id = id;
        this.name = name;
        this.token = token;
}

function ShortUserModel(id, name) {
        this.id = id;
        this.name = name;
}

module.exports = {
    User: UserModel,
    ShortUser: ShortUserModel
}