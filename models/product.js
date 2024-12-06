import { ObjectId } from "mongodb";
import { getDb } from "../util/database.js";

export default class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOperations;
    if (this._id) {
      dbOperations = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOperations = db.collection("products").insertOne(this);
    }

    return dbOperations.then((results) => {}).catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new ObjectId(prodId) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((err) => console.log(err));
  }

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new ObjectId(prodId) })
      .then(() => {
        console.log("Product Deleted!");
      })
      .catch((err) => console.log(err));
  }
}
