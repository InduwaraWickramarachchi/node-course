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
} from "../controllers/shop.js";

const router = Router();

router.get("/", getIndex);

router.get("/products", getProducts);

router.get("/products/:productId", getOneProduct);

router.get("/cart", getCart);

router.post("/cart", postCart);

router.post("/cart-delete-item", PostCartDeleteProduct);

router.post("/create-order", postOrders);

router.get("/orders", getOrders);

// router.get("/checkout", shopController.getCheckout);

export default router;
