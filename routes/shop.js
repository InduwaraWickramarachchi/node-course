import { Router } from "express";

import {
  getIndex,
  getProducts,
  getOneProduct,
  postCart,
  getCart,
  PostCartDeleteProduct,
  getOrders,
  postOrders,
  getInvoice,
} from "../controllers/shop.js";
import isAuth from "../middileware/is-auth.js";

const router = Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getOneProduct);

router.get("/cart", isAuth, getCart);

router.post("/cart", isAuth, postCart);

router.post("/cart-delete-item", isAuth, PostCartDeleteProduct);

router.post("/create-order", isAuth, postOrders);

router.get("/orders", isAuth, getOrders);

router.get("/orders/:orderId", isAuth, getInvoice);

// router.get("/checkout", shopController.getCheckout);

export default router;
