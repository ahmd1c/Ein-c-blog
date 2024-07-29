const mongoose = require("mongoose");

exports.likeFunction = async (req, res, docId, model) => {

  if (!mongoose.isValidObjectId(docId))
    return res.status(400).json({ state: "invalid id" });

  const likerId = req.userId;
  let doc = await model.findById(docId);

  if (!doc) return res.status(404).json({ state: "document not found" });

  if (!doc.likes.includes(likerId)) {

    doc = await doc.updateOne({ $push: { likes: likerId } }, { new: true });
    // TO IDENTIFY THE TYPE OF DOC WHETHER COMMENT OR POST
    if (doc.comment) await doc.populate("user", "_id name profilePhoto");
    return res.status(200).json({
      state: "liked",
      data: doc,
    });

  } else {
    doc = await doc.updateOne({ $pull: { likes: likerId } }, { new: true });
    if (doc.comment) await doc.populate("user", "_id name profilePhoto");
    return res.status(200).json({
      state: "unliked",
      data: doc,
    });
  }
};

