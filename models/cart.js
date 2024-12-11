import { readFile, writeFile } from "fs";
import { join, dirname } from "path";

const p = join(
  dirname(process?.mainModule?.filename ?? ""),
  "data",
  "cart.json",
);

export default class Cart {
  static addProductToCart(id, productPrice) {
    // fetch the previous cart
    let cart = { products: [], totalPrice: 0 };

    readFile(p, (err, data) => {
      if (!err) {
        cart = JSON.parse(data);
      }

      // analyze the cart => find the existing products
      let updatedProduct;
      const existingProductIndex = cart.products.findIndex(
        (prod) => prod.id === id,
      );
      const existingProduct = cart.products[existingProductIndex];
      // add new products / increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity = existingProduct.quantity + 1;
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;

      writeFile(p, JSON.stringify(cart), (err) => console.log(err));
    });
  }

  static deleteProductFromCart(id, productPrice) {
    readFile(p, (err, data) => {
      if (err) {
        return;
      }
      const updatedCart = { ...JSON.parse(data) };
      const toBeDeletedProduct = updatedCart.products.find(
        (prod) => prod.id === id,
      );
      if (!toBeDeletedProduct) {
        return;
      }
      const toBeDeletedProductQuantity = toBeDeletedProduct.quantity;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id,
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - productPrice * toBeDeletedProductQuantity;
      writeFile(p, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static getCartProducts(callback) {
    readFile(p, (err, data) => {
      const cart = JSON.parse(data);
      if (err) {
        callback(null);
      } else {
        callback(cart);
      }
    });
  }
}
