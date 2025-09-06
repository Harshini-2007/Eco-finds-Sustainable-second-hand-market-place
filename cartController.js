import Cart from "../Models/Cart.js";
import Order from "../Models/Order.js";
import User from "../Models/User.js";
// Add to cart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    next(err);
  }
};

// Get user cart
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.json(cart || { items: [] });
  } catch (err) {
    next(err);
  }
};

// Remove item from cart
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    res.json(cart);
  } catch (err) {
    next(err);
  }
};



// Checkout → create order + move items to previousPurchases + clear cart
export const checkout = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Create new order
    const order = new Order({
      user: req.user._id,
      items: cart.items,
      totalAmount,
    });
    await order.save();

    // Move items into user's previous purchases
    const user = await User.findById(req.user._id);
    cart.items.forEach((item) => {
      user.previousPurchases.push({
        product: item.product._id,
        quantity: item.quantity,
        purchasedAt: new Date(),
      });
    });
    await user.save();

    // Clear the cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Checkout successful. Order created, cart cleared, and purchases saved.",
      order,
      previousPurchases: user.previousPurchases,
    });
  } catch (err) {
    next(err);
  }
};
// Get user orders
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.product");
    res.json(orders);
  } catch (err) {
    next(err);
  }
};
