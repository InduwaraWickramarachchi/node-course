import express from "express";
import { fileURLToPath } from "url";
import { join } from "path";
import path from "path";
import { get404 } from "./controllers/error.js";
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import User from "./models/user.js";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));

app.use(express.static(join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("67566200565f4670f13a12fc")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404);

mongoose
  .connect("mongodb://localhost:27017/node-course")
  .then(() => {
    console.log("Connected to the database!!");

    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          username: "Si5",
          email: "test@gmail.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err) => console.log(err));
