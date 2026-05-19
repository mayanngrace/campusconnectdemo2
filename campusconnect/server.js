const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path"); // 🆕 [ADDED] for file paths

const app = express();

app.use(express.json());

// ==============================
// 🆕 [ADDED] Serve static files
// ==============================
app.use(express.static(path.join(__dirname, "public")));


// ==============================
// 🆕 Session Middleware
// ==============================
app.use(session({
    secret: "secret123",
    resave: false,
    saveUninitialized: true
}));

// ==============================
// MongoDB Connection
// ==============================
// mongoose.connect("mongodb://127.0.0.1:27017/communityDB")
//     .then(() => console.log("MongoDB Connected"))
//     .catch(err => console.log(err));

require("dotenv").config();
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// ==============================
// Schema + Model
// ==============================
const postSchema = new mongoose.Schema({
    title: String,
    category: String
});

const Post = mongoose.model("Post", postSchema);

// ==============================
// AUTH MIDDLEWARE
// ==============================
function isAuthenticated(req, res, next) {
    if (req.session.user) return next();
    res.redirect("/loginPage");
}


// ==============================
// LOGIN ROUTE
// ==============================
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "123") {
        req.session.user = { role: "admin" };
        return res.json({ role: "admin" });
    }

    if (username === "student" && password === "123") {
        req.session.user = { role: "student" };
        return res.json({ role: "student" });
    }

    res.status(401).send("Invalid credentials");
});


// ==============================
// LOGOUT
// ==============================
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/loginPage");
    });
});


// ==============================
// ROUTES (NOW USING HTML FILES)
// ==============================
app.get("/", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "public/dashboard.html"));
});

app.get("/about", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "public/about.html"));
});

app.get("/courses", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "public/courses.html"));
});

app.get("/student", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "public/student.html"));
});

app.get("/community", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "public/community.html"));
});

app.get("/loginPage", (req, res) => {
    res.sendFile(path.join(__dirname, "public/login.html"));
});


// ==============================
// CRUD API
// ==============================
app.get("/me", isAuthenticated, (req, res) => {
    res.json(req.session.user);
});

app.get("/posts", isAuthenticated, async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

app.post("/posts", isAuthenticated, async (req, res) => {
    if (req.session.user.role === "admin") {
        return res.status(403).json({ error: "Admins cannot create posts" });
    }
    const newPost = await Post.create(req.body);
    res.json(newPost);
});

app.delete("/posts/:id", isAuthenticated, async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.send("Deleted");
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});