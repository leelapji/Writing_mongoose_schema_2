const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON requests

// Connect to MongoDB (Replace 'blogDB' with your actual DB name if needed)
mongoose.connect('mongodb://localhost:27017/blogDB')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// Define Mongoose Schema and Model
const blogSchema = new mongoose.Schema({
  title: { type: String, unique: true, required: true, minlength: 5 },
  content: { type: String, required: true, minlength: 50 },
  author: String,
  tags: [String],
  category: { type: String, default: "General" },
  likes: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const Blog = mongoose.model('Blog', blogSchema);

// Routes

// Create a new blog post
app.post('/blogs', async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all blog posts
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a blog post by ID
app.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog post not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a blog post by ID
app.put('/blogs/:id', async (req, res) => {
  try {
    req.body.updatedAt = new Date(); // Update timestamp
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ error: "Blog post not found" });
    res.json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a blog post by ID
app.delete('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog post not found" });
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
