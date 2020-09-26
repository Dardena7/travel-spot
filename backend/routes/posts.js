const express = require("express");
const Post = require('../models/post');
const User = require('../models/user');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

const storage = require('../utils/multer-storage');

router.post('', checkAuth, multer({storage: storage}).single("picture"), (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        author_id: req.userData.id,
        country: req.body.country,
        city: req.body.city,
        picture: url + "/images/" + req.file.filename,
        description: req.body.description
    });
    post.save().then( response => {
        res.status(201).json({
            message: 'Post added successfully',
            postId: response._id,
            postPicture: post.picture
        })
    })
    .catch(err => {
        res.status(404).json(err);
    });
});

router.get('', checkAuth, (req, res, next) => {
    const postQuery = Post.find().sort({date:-1});
    postQuery.skip(+req.query.currentAmount).limit(2);
    postQuery.then(posts => {
        getAuthors(posts).then(posts => {
            res.status(200).json({
                message: 'Posts fetched with success',
                posts: posts
            });
        });
    })
    .catch(err => {
        res.status(404).json(err);
    });;
});

router.get('/:id', checkAuth, (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        getAuthor(post).then(postData => {
            res.status(200).json({
                message: 'Post fetched with success',
                postData: postData
            });
        });
    })
    .catch(err => {
        res.status(404).json(err);
    });
});

router.delete('/:id', checkAuth, (req, res, next) => {
    Post.deleteOne({_id: req.params.id, author_id: req.userData.id}).then(response => {
        if (response.n > 0) {
            res.status(200).json({message: 'Post deleted'});
        }
        else {
            res.status(401).json({message: 'Not authorized'});
        }
    })
    .catch(err => {
        res.status(404).json(err);
    });
});

router.put('', checkAuth, multer({storage: storage}).single("picture"), (req, res, next) => {
    let picture = req.body.picture;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        picture = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        country: req.body.country,
        city: req.body.city,
        picture: picture,
        description: req.body.description
    });
    Post.updateOne({_id: post._id, author_id: req.userData.id}, post).then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                success: true,
                message: 'Post updated with success',
                postPicture: picture
            });
        }
        else {
            res.status(200).json({
                success: false,
                message: 'Not Authorized',
                postPicture: ''
            });
        }
    })
    .catch(err => {
        res.status(404).json(err);
    });
});

function getAuthors(posts) {
    let postsWithAuthors = posts.map(post => {
        return getAuthor(post);
    });
    return Promise.all(postsWithAuthors);
}

function getAuthor(post) {
    return new Promise((resolve, reject) => {
        User.findById(post.author_id).then(
            user => {
                resolve(
                    { 
                        post: post,
                        author: {
                            id: user._id,
                            name:  user.name,
                            picture: user.picture
                        }
                    }
                );
            }
        );
    });
}

module.exports = router;