const mongoose = require('mongoose');

// Define the Comment Schema (Embedded)
const commentSchema = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    commentedAt: { type: Date, default: Date.now }
});

// Define the Blog Schema
const blogSchema = new mongoose.Schema({
    title: { type: String, unique: true, minlength: 5, required: true },
    content: { type: String, minlength: 50, required: true },
    author: { type: String, required: true },
    tags: { type: [String], default: [] },
    category: { type: String, default: "General" },
    likes: { type: [String], default: [] },
    comments: [commentSchema],  // Embedded comments
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

// Pre-save middleware to update `updatedAt`
blogSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
