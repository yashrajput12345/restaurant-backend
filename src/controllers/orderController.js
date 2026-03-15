const Order = require("../models/Order");
const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


// ===============================
// ✅ CREATE ORDER (ONLINE + COD)
// ===============================
exports.createOrder = async (req, res) => {
  try {

    const { items, totalAmount, address, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    if (!totalAmount || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ===============================
    // CASH ON DELIVERY
    // ===============================
    if (paymentMethod === "cod") {

      const order = await Order.create({
        user: req.user._id,
        items,
        totalAmount,
        address,
        paymentMethod: "cod",
        paymentStatus: "pending",
        orderStatus: "placed"
      });

      // ✅ Populate order for realtime
      const populatedOrder = await Order.findById(order._id)
        .populate("user", "name email")
        .populate("items.menuItem");

      const io = req.app.get("io");
      io.emit("newOrder", populatedOrder);

      return res.status(201).json({
        orderId: order._id,
        cod: true
      });
    }

    // ===============================
    // ONLINE PAYMENT (STRIPE)
    // ===============================
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100),
      currency: "aed",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never"
      }
    });

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      address,
      paymentMethod: "online",
      stripePaymentIntentId: paymentIntent.id,
      paymentStatus: "pending",
      orderStatus: "placed"
    });

    // ✅ Populate order for realtime
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.menuItem");

    const io = req.app.get("io");
    io.emit("newOrder", populatedOrder);

    res.status(201).json({
      orderId: order._id,
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// ✅ GET USER ORDERS
// ===============================
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// ✅ GET ALL ORDERS (ADMIN)
// ===============================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// ✅ UPDATE ORDER STATUS (ADMIN)
// ===============================
exports.updateOrderStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    // ✅ Populate before sending update
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.menuItem");

    const io = req.app.get("io");
    io.emit("orderUpdated", populatedOrder);

    res.json({ message: "Order status updated", order: populatedOrder });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// ✅ STRIPE WEBHOOK
// ===============================
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    try {
      await Order.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { paymentStatus: "paid" }
      );

      console.log("Payment successful & order updated.");
    } catch (err) {
      console.error("Error updating order:", err);
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;

    try {
      await Order.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { paymentStatus: "failed" }
      );

      console.log("Payment failed & order updated.");
    } catch (err) {
      console.error("Error updating order:", err);
    }
  }

  res.json({ received: true });
};