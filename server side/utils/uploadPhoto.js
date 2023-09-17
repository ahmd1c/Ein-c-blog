
const multer = require("multer")
const sharp = require("sharp")
const path = require("path")



const storage = multer.diskStorage({
    filename : (req , file , cb)=>{
        cb(null , `${Date.now()}_${file.originalname}`)
    },

    destination : (req , file , cb)=>{
        cb(null , `./public`)
    }
})

const uploadPhotos = multer({
    storage,
    fileFilter : (req , file , cb)=>{
        if(file.mimetype.startsWith("image")) return cb(null , true)
        return cb(null , false)
    }
})

module.exports = uploadPhotos