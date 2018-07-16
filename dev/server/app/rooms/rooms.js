const crud = require("../../mongo/mongo.crud");
const room = require("../../mongo/room/create.document").create;
const Room = require("../room/room.class");
const ObjectId = require("mongodb").ObjectID;
const roomsMap = require("./handlers/access.map")("rooms");

// const rooms = () => {
  const getAll = options => {
    let {collection} = Object(options);
    return crud.getAll({
      "collection": collection,
      "properties": ["_id", "name"]
    });
  };

  const getOne = options => {
    // console.log("hop hop");
    let {collection, roomId} = Object(options);
    // console.log(`tries to get one: roomId: ${roomId} collection: ${collection}`);
    return new Promise((res, rej) => {
      // console.log("hop hop 2");
      // console.log(`in map ${roomId}: ${JSON.stringify(roomsMap.getOne(roomId))}`);
      if (roomsMap.getOne(roomId) !== undefined) {
        // console.log("hop hop 3");
        // console.log("is instance of room: " + roomsMap.getOne(roomId) instanceof Room);
        res(roomsMap.getOne(roomId));
      } else {
        // console.log("hop hop 4");
        // console.log("is NOT instance of room");
        // console.log("weeee");
        let id = ObjectId(roomId);
        // console.log("roomId: " + roomId + " objectId " + id + "same: " + roomId===id);
        crud.findOne({
          "collection": collection,
          "query": {"_id": id}
        })
        .then(result => {
          // console.log(`getOne result._id ${result._id}`);
          // console.log(`getOne room result ${JSON.stringify(result)}`);
          // console.log("weeee");
          roomsMap.setOne([
            result._id,
            new Room(result)
          ]);
          // console.log("had if: " + result._id);
          // console.log("got: " + roomsMap.getOne(result._id));
          res(roomsMap.getOne(result._id));
        })
        .catch(err => {
          console.log("got err");
          rej(err);
        });
      }
    });
  };

  const uniqueName = options => {
    let name = options.name;
    return new Promise(res => {
      getAll({
        collection: options.collection
      })
      .then(result => {
        let existingNames = result.map(room => {
          return room.name;
        });
        let i = 0;
        let newName = name;
        /** The promise is never rejected - just different name is used! */
        while(existingNames.includes(newName)) {
          newName = name + ++i;
        }
        existingNames = null;
        res(newName);
      })
      .catch(err => {
        console.log(err);
        return name; // TODO ???
      });
    })
  };

  const createOne = options => {
    return uniqueName({
      "name": options.name,
      "collection": options.collection
    })
    .then(newName => {
      // console.log("111")
      options.name = newName;
      return new Promise((res, rej) => {
        // console.log("hop" + JSON.stringify(options));
        crud.insertOne({
          "collection": options.collection,
          "object": room(options)
        })
        .then(result => {
          let id = result._id;
          // console.log("222")
          roomsMap.setOne([
            id,
            new Room(result)
          ]);
          // console.log(`Room set in map: ${JSON.stringify(roomsMap.getOne(id))}`);
          res(id);
        })
        .catch(err => {
          rej(err);
        });
      });
    })
    .catch(err => {
      // TODO !!!!
      return new Promise((res, rej) => {
        rej(err);
      });
    });
  };

  // return {
  //   getAll: data => getAll(data),
  //   getOne: data => getOne(data),
  //   createOne: data => createOne(data)
  // }
// }
  const updateOne = options => {
    let {id, room} = options;
    console.log("updating room: " + id + JSON.stringify(room));
    roomsMap.setOne([id, new Room(room)]);
  }

module.exports = {
  getAll: data => getAll(data),
  getOne: data => getOne(data),
  createOne: data => createOne(data),
  updateOne: data => updateOne(data)
}
