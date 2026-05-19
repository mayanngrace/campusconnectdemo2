const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();

app.use(express.json());

// ==============================
// 🆕[ADDED] Session Middleware
// ==============================
app.use(session({
    secret: "secret123",
    resave: false,
    saveUninitialized: true
}));


// ==============================
// MongoDB Connection
// ==============================
mongoose.connect("mongodb://127.0.0.1:27017/communityDB")
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
// 🆕 [ADDED] AUTH MIDDLEWARE
// ==============================
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect("/loginPage");
}


// ==============================
// 🆕[ADDED] LOGIN ROUTE
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
// 🆕[ADDED] LOGOUT ROUTE
// ==============================
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/loginPage");
    });
});


// ==============================
// 🆕[ADDED] LOGIN PAGE
// ==============================
app.get("/loginPage", (req, res) => {
    res.send(`
      <h1>Login</h1>
      <input id="username" placeholder="Username">
      <input id="password" type="password" placeholder="Password">
      <button onclick="login()">Login</button>

      <script>
        async function login() {
          const username = document.getElementById("username").value;
          const password = document.getElementById("password").value;

          const res = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
          });

          if (res.ok) {
            window.location.href = "/";
          } else {
            alert("Invalid login");
          }
        }
      </script>
    `);
});


// ==============================
// 🔁[ADDED] HOME PAGE (NOW PROTECTED)
// ==============================
app.get("/", isAuthenticated, (req, res) => {
    res.send(`
    <h1>Student Dashboard</h1>
    <p>Welcome to your backend-powered website!</p>

    <a href="/logout"><button>Logout</button></a>

    <ul>
      <li><a href="/about">About</a></li>
      <li><a href="/courses">Courses</a></li>
      <li><a href="/student">Student Profile</a></li>
      <li><a href="/community">Community</a></li>
    </ul>
  `);
});


// ==============================
// 🔁 ABOUT PAGE (PROTECTED)
// ==============================
app.get("/about", isAuthenticated, (req, res) => {
    res.send(`
    <h1>About</h1>
    <p>Welcome!</p>
    <a href="/">Go Home</a>
  `);
});


// ==============================
// 🔁 COURSES PAGE (PROTECTED)
// ==============================
app.get("/courses", isAuthenticated, (req, res) => {
    res.send(`
    <h1>My Courses</h1>
    <ul>
      <li>Web Development</li>
      <li>Data Structures</li>
    </ul>
    <a href="/">Go Home</a>
  `);
});


// ==============================
// 🔁 STUDENT PROFILE (PROTECTED)
// ==============================
app.get("/student", isAuthenticated, (req, res) => {
    res.send(`
    <h1>Student Profile</h1>
    <p>Name: Your Name</p>
    <a href="/">Go Home</a>
  `);
});


// ==============================
// CRUD ROUTES (PROTECTED)
// ==============================

// 🟢 GET
app.get("/posts", isAuthenticated, async (req, res) => {
    const posts = await Post.find();
    res.json(posts);
});

// 🟢 POST
app.post("/posts", isAuthenticated, async (req, res) => {
    const newPost = await Post.create(req.body);
    res.json(newPost);
});

// 🔴 DELETE
app.delete("/posts/:id", isAuthenticated, async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.send("Deleted");
});


// ==============================
// COMMUNITY PAGE (PROTECTED)
// ==============================
app.get("/community", isAuthenticated, (req, res) => {
    res.send(`
    <html>
    <body>

      <h1>Student Community</h1>

      <a href="/"><button>Back</button></a>
      <a href="/logout"><button>Logout</button></a>

      <br><br>

      <input id="title" placeholder="Post title">
      <select id="category">
        <option>Task</option>
        <option>Service</option>
        <option>Selling</option>
      </select>

      <button onclick="addPost()">Add Post</button>

      <ul id="postList"></ul>

      <script>
        const API = "/posts";

        async function loadPosts() {
          const res = await fetch(API);
          const data = await res.json();

          const list = document.getElementById("postList");
          list.innerHTML = "";

          data.forEach(post => {
            const li = document.createElement("li");
            li.innerText = post.title + " (" + post.category + ")";

            const btn = document.createElement("button");
            btn.innerText = "Delete";
            btn.onclick = () => deletePost(post._id);

            li.appendChild(btn);
            list.appendChild(li);
          });
        }

        async function addPost() {
          const title = document.getElementById("title").value;
          const category = document.getElementById("category").value;

          await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, category })
          });

          loadPosts();
        }

        async function deletePost(id) {
          await fetch(API + "/" + id, {
            method: "DELETE"
          });

          loadPosts();
        }

        loadPosts();
      </script>

    </body>
    </html>
  `);
});


// ==============================
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});