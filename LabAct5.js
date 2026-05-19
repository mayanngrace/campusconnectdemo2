const express = require("express");
const app = express();

// HOME PAGE
app.get("/", (req, res) => {
    res.send(`
    <h1>Student Dashboard</h1>
    <p>Welcome to your backend-powered website!</p>
    <ul>
      <li><a href="/about">About</a></li>
      <li><a href="/courses">Courses</a></li>
      <li><a href="/student">Student Profile</a></li>
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

// SERVER
app.listen(3000, () => {
    console.log("Server running on port 3000");
});