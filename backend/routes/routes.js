const express = require("express");
const router = express.Router();

const postsRoutes = require('./posts');
const userRoutes = require('./user');

router.use("/api/posts", postsRoutes);
router.use("/api/user", userRoutes);

module.exports = router;