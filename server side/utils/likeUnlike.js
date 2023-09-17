const mongoose = require("mongoose");

exports.likeFunction = async( req , res , docId , model)=>{

    if (mongoose.isValidObjectId(docId)) {
        
        const likerId = req.userId;
        let doc = await model.findById(docId)
        
    
        if (doc && !doc.likes.includes(likerId) ) {
            doc.likes.push(likerId)
            if(doc.comment) await doc.populate("user", "_id name profilePhoto")
            await doc.save()
            return res.status(200).json
            ({
                state: "liked",
                data: doc,
            });
    
        }else if(doc && doc.likes.includes(likerId)){
            if(doc.comment){ 
                doc = await model.findByIdAndUpdate(docId,{$pull:{likes:likerId}},{new:true}).populate("user", "_id name profilePhoto")
            }else{
                doc = await model.findByIdAndUpdate(docId,{$pull:{likes:likerId}},{new:true})

            }
            return res.status(200).json
            ({
                state: "unliked",
                data: doc,
            });
        }else{
            return res.sendStatus(404)
        }        

    }else{
        console.log(docId)
        res.sendStatus(400)
    }
}



// original code for Posts only
//   if (mongoose.isValidObjectId(postId)) {

//     const likerId = req.userId;
//     let post = await Posts.findById(postId)

//     if (post && !post.likes.includes(likerId) ) {
//         post = await Posts.findByIdAndUpdate(postId,{$push:{likes:likerId}},{new:true})

//     }else if(post && post.likes.includes(likerId)){
//         post = await Posts.findByIdAndUpdate(postId,{$pull:{likes:likerId}},{new:true})

//     }else{
//         res.sendStatus(404)
//     }
//     res.status(200).json({
//         state: "success",
//         data: post,
//     });
// }