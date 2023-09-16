const express = require('express')
const router = express.Router({mergeParams:true});
const commentValidation = require('../validation/commentValidation');
const { protectRoute, adminValidation } = require('../utils/authHandler');
const { 
    getCommentsForSpecificPost,
    makeComment, 
    modifyComment, 
    toggleLikeUnlikeComment, 
    deleteComment, 
} = require('../controllers/commentHandler');



router.route('/').get(getCommentsForSpecificPost)
router.route('/').post(protectRoute,commentValidation,makeComment)
router.route('/:commentId').put(protectRoute,commentValidation,modifyComment)
router.route('/:commentId').patch(protectRoute,toggleLikeUnlikeComment)
router.route('/:commentId').delete(protectRoute,deleteComment)
router.route('/').delete(adminValidation,deleteComment)

module.exports = router