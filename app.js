require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const { PORT = 8080 } = process.env;

// Security
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");

// Config
const { ALLOWED_CORS, DEFAULT_ALLOWED_METHODS, DB_URL } = require("./config");

// Middlewares
const {
  errorHandler,
  requestLogger,
  errorLogger,
  limiter,
} = require("./middlewares");

const app = express();

const connectDB = async () => {
  await mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

app.use(requestLogger);

app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (ALLOWED_CORS.includes(origin)) return callback(null, true);
      return callback(new Error("Ошибка CORS"), true);
    },
    methods: DEFAULT_ALLOWED_METHODS,
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.use(require("./routes/index"));

app.use(errorLogger);
app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
connectDB();
