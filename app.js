import express from "express";

import { fileURLToPath } from "url";

import { join } from "path";
import path from "path";

import { get404 } from "./controllers/error.js";
import { mongoConnect } from "./util/database.js";

import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import User from "./models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));

app.use(express.static(join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("6749fbdeb765eabdaef36dd0")
    .then((user) => {
      req.user = new User(user.username, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoConnect(() => {
  app.listen(3000);
});
