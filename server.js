const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= STATIC FRONTEND ================= */

app.use(express.static(path.join(__dirname, "../frontend")));

/* ================= FILE PATHS ================= */

const USERS_FILE = path.join(__dirname, "db", "users.json");
const SALES_FILE = path.join(__dirname, "db", "sales.json");

/* =================================================
   LOGIN
================================================= */

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const users = JSON.parse(fs.readFileSync(USERS_FILE));

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    id: user.id,
    username: user.username,
    role: user.role
  });
});

/* =================================================
   USERS API
================================================= */

app.get("/api/users", (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  res.json(users);
});

app.post("/api/users", (req, res) => {
  const { username, password, role } = req.body;

  const users = JSON.parse(fs.readFileSync(USERS_FILE));

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "Username exists" });
  }

  const newUser = {
    id: Date.now(),
    username,
    password,
    role
  };

  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ message: "User created" });
});

app.delete("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  let users = JSON.parse(fs.readFileSync(USERS_FILE));

  users = users.filter((u) => u.id !== id);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ message: "User deleted" });
});

/* =================================================
   SALES API
================================================= */

/* 🔹 SAVE SALE */
app.post("/api/sales", (req, res) => {
  const saleData = req.body;

  const sales = JSON.parse(fs.readFileSync(SALES_FILE));

  const newSale = {
    id: Date.now(),
    date: new Date().toISOString(),
    ...saleData
  };

  sales.push(newSale);

  fs.writeFileSync(SALES_FILE, JSON.stringify(sales, null, 2));

  res.json({ message: "Sale saved" });
});

/* 🔹 GET ALL SALES */
app.get("/api/sales", (req, res) => {
  const sales = JSON.parse(fs.readFileSync(SALES_FILE));
  res.json(sales);
});

/* ================================================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});