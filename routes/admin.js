import { Router } from "express";

import {
  getAddProduct,
  getProducts,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} from "../controllers/admin.js";
import isAuth from "../middileware/is-auth.js";
import { body } from "express-validator";

const router = Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title")
      .isString()
      .isLength({ min: 3 })
      .withMessage("Title should be at least 3 characters!")
      .trim(),
    body("imageUrl").isURL().withMessage("Image Url must be valid!"),
    body("price").isFloat().withMessage("Price must be valid!"),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Description should be at least 5 characters!")
      .trim(),
  ],
  isAuth,
  postAddProduct,
);

// admin/edit-product => GET
router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("imageUrl").isURL(),
    body("price").isFloat(),
    body("description").isLength({ min: 5 }).trim(),
  ],
  isAuth,
  postEditProduct,
);

router.post("/delete-product", isAuth, postDeleteProduct);

export default router;
