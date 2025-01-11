import Product from "../models/product.js";
import Order from "../models/order.js";
import { createReadStream, createWriteStream, readFile } from "fs";
import path from "path";
import PDFDocument from "pdfkit";

export function getProducts(req, res, next) {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

export function getIndex(req, res, next) {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

export function getCart(req, res, next) {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: user.cart.items,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

export function postCart(req, res, next) {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

export function PostCartDeleteProduct(req, res, next) {
  const prodId = req.body.productId;
  req.user
    .removeItemFromCart(prodId)
    .then(res.redirect("/cart"))
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

export function postOrders(req, res, next) {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { product: { ...item.productId._doc }, quantity: item.quantity };
      });

      const order = new Order({
        user: {
          userId: req.user,
          username: req.user.username,
        },
        products: products,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}

export function getOrders(req, res, next) {
  Order.find({ "user.userId": req.user._id }).then((orders) => {
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

export function getInvoice(req, res, next) {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No order found!"));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized!"));
      }

      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join("data", "invoices", invoiceName);

      // readFile method is not suitable for large files because it store all file data into memory before serve it.

      // readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     `inline; filename="${invoiceName}"`
      //   );
      // });

      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);
      pdfDoc.pipe(createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(20).text("Invoice", { underline: true });
      pdfDoc.text(
        "------------------------------------------------------------",
      );

      let totalPrice = 0;
      order.products.forEach((product) => {
        totalPrice += product.product.price * product.quantity;
        pdfDoc
          .fontSize(14)
          .text(
            `${product.product.title} --- Qty(${product.quantity}) X $${product.product.price}`,
          );
      });
      pdfDoc
        .fontSize(20)
        .text("------------------------------------------------------------");
      pdfDoc.fontSize(18).text(`Total Price: $${totalPrice}`);

      pdfDoc.end();

      // const fileStream = createReadStream(invoicePath);
      // res.setHeader("Content-Type", "application/pdf");
      // res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);
      // fileStream.pipe(res);

      fileStream.on("error", (err) => {
        next(new Error("Error reading the file!"));
        res.status(500).send("Internal server error!");
      });
    })
    .catch((err) => next(err));
}
