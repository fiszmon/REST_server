function ListModel(id, name, tracks = [], owner, sharedWith = [] ) {
    this.id = id;
    this.name = name;
    this.tracks = tracks;
    this.owner = owner;
    this.sharedWith = sharedWith;
}

function ShortListModel(id, name) {
    this.id = id;
    this.name = name;
}

module.exports = {
    List: ListModel,
    ShortList: ShortListModel
};