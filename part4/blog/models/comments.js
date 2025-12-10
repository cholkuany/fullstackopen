const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comments: [{ type: String }],
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  },
});

commentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    (returnedObject.id = returnedObject._id.toString()),
      delete returnedObject.__v;
    delete returnedObject._id;
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
