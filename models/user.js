import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeItemFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;

  return this.save();
};

userSchema.methods.postOrder = function () {
  return this.getCartProducts()
    .then((products) => {
      const order = {
        items: products,
        user: {
          id: new ObjectId(this._id),
          name: this.username,
        },
      };
      return database.collection("orders").insertOne(order);
    })
    .then(() => {
      this.cart = { items: [] };
      return database
        .collection("users")
        .updateOne(
          { _id: new ObjectId(this._id) },
          { $set: { cart: { items: [] } } },
        );
    })
    .catch((err) => console.log(err));
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

export default mongoose.model("User", userSchema);

// import { ObjectId } from "mongodb";
// import { getDb } from "../util/database.js";

// export default class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart; // {items: []}
//     this._id = id;
//   }

//   save() {
//     const db = getDb();

//     return db
//       .collection("users")
//       .insertOne(this)
//       .then(() => {
//         console.log("User Created!");
//       })
//       .catch((err) => console.log(err));
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     const updatedCart = {
//       items: updatedCartItems,
//     };

//     const database = getDb();
//     return database
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } },
//       );
//   }

//   getCartProducts() {
//     const db = getDb();
//     const productIds = this.cart.items.map((item) => {
//       return item.productId;
//     });
//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((prod) => {
//           return {
//             ...prod,
//             quantity: this.cart.items.find((item) => {
//               return item.productId.toString() === prod._id.toString();
//             }).quantity,
//           };
//         });
//       });
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter((item) => {
//       return item.productId.toString() !== productId.toString();
//     });
//     const database = getDb();
//     return database
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } },
//       );
//   }

//   addOrder() {
//     const database = getDb();

//     return this.getCartProducts()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             id: new ObjectId(this._id),
//             name: this.username,
//           },
//         };
//         return database.collection("orders").insertOne(order);
//       })
//       .then(() => {
//         this.cart = { items: [] };
//         return database
//           .collection("users")
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } },
//           );
//       })
//       .catch((err) => console.log(err));
//   }

//   getOrders() {
//     const database = getDb();
//     return database
//       .collection("orders")
//       .find({ "user.id": new ObjectId(this._id) })
//       .toArray();
//   }

//   static findById(userId) {
//     const db = getDb();

//     return db
//       .collection("users")
//       .find({ _id: new ObjectId(userId) })
//       .next()
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => console.log(err));
//   }
// }
