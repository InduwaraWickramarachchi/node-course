import Product from "../models/product.js";

export function getAddProduct(req, res, next) {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
}

export function postAddProduct(req, res, next) {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });
  product
    .save()
    .then(() => {
      console.log("Product Created!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
}

export function getEditProduct(req, res, next) {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
}

export function postEditProduct(req, res, next) {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageIrl = req.body.imageUrl;
  const updatedDescription = req.body.description;

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDescription;
      product.imageUrl = updatedImageIrl;

      return product.save().then(() => {
        console.log("PRODUCT UPDATED!");
        res.redirect("/admin/products");
      });
    })

    .catch((err) => console.log(err));
}

export function getProducts(req, res, next) {
  Product.find({ userId: req.user._id })
    // .select("title price")
    // .populate("userId", "username email")
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
}

export function postDeleteProduct(req, res, next) {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
}
