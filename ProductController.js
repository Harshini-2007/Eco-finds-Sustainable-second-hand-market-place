import Product from "../Models/Product.js";

// Create product
export const createProduct = async (req, res, next) => {
  try {
    const { title, description, category, price } = req.body;

    const product = new Product({
      title,
      description,
      category,
      price,
      createdBy: req.user._id,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    next(err);
  }
};

// Get all products (with optional search & filter)
export const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: "i" };

    const products = await Product.find(filter).populate("createdBy", "username email");
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// Get single product
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("createdBy", "username email");
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// Update product
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (product.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this product");
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
};

// Delete product
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    if (product.createdBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this product");
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    next(err);
  }
};


// Browse products with keyword search + category filter
export const browseProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Keyword search (title + description)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },        // match in title
        { description: { $regex: search, $options: "i" } }  // match in description
      ];
    }

    const products = await Product.find(filter)
      .select("title price imagePlaceholder category description")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    next(err);
  }
};

// Get product details by ID
export const getProductDetails = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "username email"
    );

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.json({
      _id: product._id,
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      imagePlaceholder: product.imagePlaceholder,
      createdBy: product.createdBy,
      createdAt: product.createdAt,
    });
  } catch (err) {
    next(err);
  }
};