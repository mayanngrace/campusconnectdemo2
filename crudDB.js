const express = require("express");

// ==============================
// 🆕 [ADDED] Import mongoose
// ==============================
const mongoose = require("mongoose");
const app = express();


// ==============================
// Middleware for JSON
// ==============================
app.use(express.json());


// ==============================
// ❌ [REMOVED] In-memory data
// let posts = [...]
// ==============================


// ==============================
// 🆕 [ADDED] Connect to MongoDB
// ==============================
mongoose.connect("mongodb://127.0.0.1:27017/communityDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// ==============================
// 🆕 [ADDED] Schema + Model
// ==============================
const postSchema = new mongoose.Schema({
  title: String,
  category: String
});

const Post = mongoose.model("Post", postSchema);


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
      <li><a href="/community">Community</a></li>
    </ul>
  `);
});

// ABOUT PAGE
app.get("/about", (req, res) => {
  res.send(`
    <h1>About</h1>
    <p>Welcome!</p>
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
    </ul>
    <a href="/">Go Home</a>
  `);
});

// STUDENT PROFILE
app.get("/student", (req, res) => {
  res.send(`
    <h1>Student Profile</h1>
    <p>Name: Your Name</p>
    <a href="/">Go Home</a>
  `);
});


// ==============================
// 🔁 [UPDATED] CRUD API ROUTES
// ==============================

// 🟢 GET - now from MongoDB
app.get("/posts", async (req, res) => {
  const posts = await Post.find(); // 🔁 CHANGED
  res.json(posts);
});

// 🟢 POST - now saves to MongoDB
app.post("/posts", async (req, res) => {
  const newPost = await Post.create(req.body); // 🔁 CHANGED
  res.json(newPost);
});

// 🔴 DELETE - now deletes from MongoDB
app.delete("/posts/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id); // 🔁 CHANGED
  res.send("Deleted");
});


// ==============================
// 🔁 [UPDATED] COMMUNITY PAGE
// ==============================
app.get("/community", (req, res) => {
  res.send(`
    <html>
    <body>

      <h1>Student Community</h1>
      <a href="/">← Back</a>

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

            // IMPORTANT CHANGE
            btn.onclick = () => deletePost(post._id); // 🔁 CHANGED (id → _id)

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