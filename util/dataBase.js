import { MongoClient } from "mongodb";

let _db;

export const mongoConnect = (callback) => {
  MongoClient.connect("mongodb://localhost:27017/node-course")
    .then((client) => {
      console.log("Connected to the database!");
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

export const getDb = () => {
  if (_db) {
    return _db;
  }
  throw new Error("No database found!");
};
