import { Router } from "express";
import {
  getLogin,
  getNewPassword,
  getReset,
  getSignup,
  postLogin,
  postLogout,
  postNewPassword,
  postReset,
  postSignup,
} from "../controllers/auth.js";
import { body, check } from "express-validator";
import User from "../models/user.js";

const router = Router();

router.get("/login", getLogin);

router.get("/signup", getSignup);

router.post(
  "/login",
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email!")
    .normalizeEmail(),
  body("password", "Password has to be valid!").isLength({ min: 5 }).trim(),
  postLogin,
);

router.post(
  "/signup",
  // check("email").isEmail().withMessage("Enter a valid email!"),
  body("username").notEmpty().withMessage("User name can not be empty!"),
  body("email")
    .isEmail()
    .withMessage("Enter a valid email!")
    .normalizeEmail()
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject(
            "This email already exists! try a different mail",
          );
        }
      });
    }),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be contain at least 5 characters!")
    .trim(),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password must be matched!");
      }
      return true;
    }),
  postSignup,
);

router.post("/logout", postLogout);

router.get("/reset", getReset);

router.post("/reset", postReset);

router.get("/new-password/:token", getNewPassword);

router.post("/new-password", postNewPassword);

export default router;
