import Product from "../models/product.js";
import Cart from "../models/cart.js";

export function getProducts(req, res, next) {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
}

export function getOneProduct(req, res, next) {
  const prodID = req.params.productId;
  Product.findById(prodID)
    .then((product) =>
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/product",
      }),
    )
    .catch((err) => console.log(err));
}

export function getIndex(req, res, next) {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
}

export function getCart(req, res, next) {
  req.user
    .getCartProducts()
    .then((products) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
}

export function postCart(req, res, next) {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then()
    .catch((err) => console.log(err));
  res.redirect("/cart");
}

export function PostCartDeleteProduct(req, res, next) {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(res.redirect("/cart"))
    .catch((err) => console.log(err));
}

export function postOrders(req, res, next) {
  req.user.addOrder().then(() => {
    res.redirect("/orders");
  });
}

export function getOrders(req, res, next) {
  req.user.getOrders().then((orders) => {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  });
}

export function getCheckout(req, res, next) {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
}
