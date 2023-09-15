const express = require('express')
const router = express.Router();
const User = require('../models/userModel') 

const { signUp,
        signIn,
        signOut,
        updateProfile,
        deleteUserAccount,
        getAllUsers,
        changePassword,
        getLikesForUser
            } = require('../controllers/userHandlers')

const { protectRoute, adminValidation } = require('../utils/authHandler');
const {signUpValidation, updateProfileValidation, signInValidation, changePasswordValidation} = require('../validation/userValidation');
const uploadPhotos = require('../utils/uploadPhoto');
const { getCommentsForSpecificUser, getAllComments } = require('../controllers/commentHandler');

router.route('/createNewUser').post( signUpValidation , signUp)
router.route('/signIn').post(signInValidation,signIn)
router.route('/signOut').get(signOut)
router.route('/updateProfile').put( protectRoute , uploadPhotos.single("image") , updateProfileValidation , updateProfile ) 
router.route('/changePassword').patch( protectRoute , changePasswordValidation , changePassword ) 
router.route('/deleteAccount').delete(protectRoute , deleteUserAccount) 
router.route('/userComments').get( protectRoute , getCommentsForSpecificUser)
router.route('/userLikes').get( protectRoute , getLikesForUser)
router.route('/admin/getAllUsers').get( adminValidation , getAllUsers)
router.route('/admin/getAllComments').get( adminValidation , getAllComments)
router.route('/').delete(adminValidation , deleteUserAccount) 


module.exports = router
