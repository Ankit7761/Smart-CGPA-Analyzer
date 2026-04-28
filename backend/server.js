const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Smart CGPA API is running" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/semesters", require("./routes/semesterRoutes"));
app.use("/api/subjects", require("./routes/subjectRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
