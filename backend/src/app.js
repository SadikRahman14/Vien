// app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowed = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean); // e.g. ["http://localhost:5173","http://localhost:5174"]

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);                    // curl/health checks
    if (allowed.includes(origin)) return cb(null, true);   // allowed FE
    return cb(null, false);                                // disallowed → browser blocks
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
};

app.use((req, res, next) => {
  res.header("Vary", "Origin");
  next();
});

app.use(cors(corsOptions));

// ✅ Express 5: use a RegExp for preflights (not "*")
app.options(/.*/, cors(corsOptions));

// parsers & cookies
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routers
import userRouter from "./routers/user.route.js";
import productRouter from "./routers/product.route.js";
import cartRouter from "./routers/cart.route.js";
import orderRouter from "./routers/order.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);

export { app };
