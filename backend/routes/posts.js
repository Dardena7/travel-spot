const express = require("express");
const Post = require('../models/post');
const multer = require('multer');

const router = express.Router();

const MIME_TYPES = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg'
};

const maxSize = 500; //kb

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let error = new Error("mime type or size invalid");
        let isValid = MIME_TYPES[file.mimetype];
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(".")[0].split(' ').join('-');
        const ext = MIME_TYPES[file.mimetype];
        cb(null, name+('-')+Date.now()+('.')+ext);
    }
});

router.post('', multer({storage: storage}).single("picture"), (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
        author: req.body.author,
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

router.get('',(req, res, next) => {
    const postQuery = Post.find().sort({date:-1});
    postQuery.skip(+req.query.currentAmount).limit(2);
    postQuery.then(posts => {
        res.status(200).json({
            message: 'Posts fetched with success',
            posts: posts
        });
    })
    .catch(err => {
        res.status(404).json(err);
    });;
});

router.get('/:id',(req, res, next) => {
    Post.findById(req.params.id).then(post => {
        res.status(200).json({
            message: 'Post fetched with success',
            post: post
        });
    })
    .catch(err => {
        res.status(404).json(err);
    });
});

router.delete('/:id',(req, res, next) => {
    Post.deleteOne({_id: req.params.id}).then(response => {
        res.status(200).json({message: 'Post deleted'});
    })
    .catch(err => {
        res.status(404).json(err);
    });
});

router.put('', multer({storage: storage}).single("picture"), (req, res, next) => {
    console.log(req.body);
    let picture = req.body.picture;
    console.log(picture);
    if (req.file) {
        console.log(req.file);
        const url = req.protocol + "://" + req.get("host");
        picture = url + "/images/" + req.file.filename;
    }
    const post = new Post({
        _id: req.body.id,
        author: req.body.author,
        country: req.body.country,
        city: req.body.city,
        picture: picture,
        description: req.body.description
    });
    Post.updateOne({_id: post._id}, post).then(result => {
        res.status(200).json({
            message: 'Post updated with success',
            postPicture: picture
        })
    })
    .catch(err => {
        res.status(404).json(err);
    });
});

module.exports = router;