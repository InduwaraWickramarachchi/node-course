import express from "express";
import { fileURLToPath } from "url";
import { join } from "path";
import path from "path";
import { get404 } from "./controllers/error.js";
import adminRoutes from "./routes/admin.js";
import shopRoutes from "./routes/shop.js";
import authRoutes from "./routes/auth.js";
import User from "./models/user.js";
import mongoose from "mongoose";
import session from "express-session";
// const MongoStore = require("connect-mongodb-session")(session);
import ConnectMongoDBSession from "connect-mongodb-session";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = "mongodb://localhost:27017/node-course";

const app = express();

const store = new ConnectMongoDBSession(session)({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));

app.use(express.static(join(__dirname, "public")));

app.use(
  session({
    secret: "this should be a long text in production",
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(get404);

mongoose
  .connect(MONGODB_URI)
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
