const express = require('express')
const router = express.Router({mergeParams:true});
const commentValidation = require('../validation/commentValidation');
const { protectRoute } = require('../utils/authHandler');
const { 
    makeReply, 
    deleteReply, 
    toggleLikeUnlikeReply, 
    modifyReply, 
    getRepliesForSpecificComment
} = require('../controllers/replyHandler');



router.route('/').get(getRepliesForSpecificComment)
router.route('/').post(protectRoute,commentValidation,makeReply)
router.route('/:replyId').delete(protectRoute,deleteReply)
router.route('/:replyId').patch(protectRoute,toggleLikeUnlikeReply)
router.route('/:replyId').put(protectRoute,commentValidation,modifyReply)


module.exports = router