const express = require('express')
const router = express.Router({mergeParams:true});
const Post = require('../models/postsModel') 
const { 
    getAllPosts,
    getSpecificPost,
    createNewPost,
    toggleLikeUnlike,
    deletePost,
    getAllPostsForSpecificUser,
    updatePost,
        
    } = require('../controllers/postsHandler');
const { protectRoute, adminValidation } = require('../utils/authHandler');
const postValidation = require('../validation/postValidation');
const uploadPhotos = require('../utils/uploadPhoto');

router.route('/getAllPosts').get(getAllPosts)
router.route('/getAllPostsForSpecificUser/:userId').get( getAllPostsForSpecificUser)
router.route('/:id').get(getSpecificPost)
router.route('/:id').delete(protectRoute,deletePost)
router.route('/').delete(adminValidation,deletePost)
router.route('/createPost').post( protectRoute,uploadPhotos.single("postPhoto"),postValidation,createNewPost)
router.route('/:id').patch(protectRoute,toggleLikeUnlike)
router.route('/:id').put(protectRoute,uploadPhotos.single("postPhoto"),updatePost)


module.exports = router