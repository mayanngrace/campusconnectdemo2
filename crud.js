const express = require("express");
const app = express();

// ==============================
// 🆕 [ADDED] Middleware for JSONS
// ==============================
app.use(express.json());


// ==============================
// 🆕 [ADDED] In-memory data (CRUD)
// ==============================
let posts = [
  { id: 1, title: "Selling notes", category: "Selling" },
  { id: 2, title: "Looking for tutor", category: "Service" }
];


// ==============================
// 🏠 EXISTING ROUTES (UNCHANGED)
// ==============================

// HOME PAGE
app.get("/", (req, res) => {
  res.send(`
    <h1>Student Dashboard</h1>
    <p>Welcome to your backend-powered website!</p>
    <ul>
      <li><a href="/about">About</a></li>
      <li><a href="/courses">Courses</a></li>
      <li><a href="/student">Student Profile</a></li>

      <!-- 🆕 [ADDED] Link to Community Page -->
      <li><a href="/community">Community</a></li>
    </ul>
  `);
});

// ABOUT PAGE
app.get("/about", (req, res) => {
  res.send(`
    <h1>About</h1>
    <p>Welcome!</p>
    <p>This is a sample server for a student dashboard</p>
    <a href="/">Go Home</a>
  `);
});

// COURSES PAGE
app.get("/courses", (req, res) => {
  res.send(`
    <h1>My Courses</h1>
    <ul>
      <li>Web Development</li>
      <li>Data Structures</li>
      <li>Algorithms</li>
    </ul>
    <a href="/">Go Home</a>
  `);
});

// STUDENT PROFILE
app.get("/student", (req, res) => {
  res.send(`
    <h1>Student Profile</h1>
    <p>Name: Your Name</p>
    <p>Course: BSCS</p>
    <p>Year: 2nd Year</p>
    <a href="/">Go Home</a>
  `);
});

// DYNAMIC ROUTE
app.get("/hello/:name", (req, res) => {
  res.send(`
    <h1>Hello, ${req.params.name}!</h1>
    <p>Welcome to your dashboard.</p>
    <a href="/">Go Home</a>
  `);
});


// ==============================
// 🆕 [ADDED] CRUD API ROUTES
// ==============================

// 🟢 GET - Fetch all posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// 🟢 POST - Add new post
app.post("/posts", (req, res) => {
  const newPost = {
    id: Date.now(),
    title: req.body.title,
    category: req.body.category
  };

  posts.push(newPost);
  res.json(newPost);
});

// 🔴 DELETE - Remove post
app.delete("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  posts = posts.filter(p => p.id !== id);
  res.send("Deleted");
});


// ==============================
// 🆕 [ADDED] COMMUNITY PAGE (Frontend + fetch)
// ==============================
app.get("/community", (req, res) => {
  res.send(`
    <html>
    <head>
      <title>Student Community</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        li { margin: 10px 0; }
        button { margin-left: 10px; }
      </style>
    </head>
    <body>

      <h1>Student Community</h1>
      <a href="/">← Back to Dashboard</a>

      <br><br>

      <!-- 🟢 INPUT FORM -->
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

        // 🟢 LOAD POSTS (GET)
        async function loadPosts() {
          const res = await fetch(API);
          const data = await res.json();

          const list = document.getElementById("postList");
          list.innerHTML = "";

          data.forEach(post => {
            const li = document.createElement("li");
            li.innerText = post.title + " (" + post.category + ")";

            // 🔴 DELETE BUTTON
            const btn = document.createElement("button");
            btn.innerText = "Delete";
            btn.onclick = () => deletePost(post.id);

            li.appendChild(btn);
            list.appendChild(li);
          });
        }

        // 🟢 ADD POST (POST)
        async function addPost() {
          const title = document.getElementById("title").value;
          const category = document.getElementById("category").value;

          await fetch(API, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, category })
          });

          loadPosts();
        }

        // 🔴 DELETE POST
        async function deletePost(id) {
          await fetch(API + "/" + id, {
            method: "DELETE"
          });

          loadPosts();
        }

        // 🚀 INITIAL LOAD
        loadPosts();
      </script>

    </body>
    </html>
  `);
});


// ==============================
// SERVER
// ==============================
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});