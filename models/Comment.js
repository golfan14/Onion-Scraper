var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  body: String
});

var Comment = mongoose.model("Comment", CommentSchema);

// Export the Note model
module.exports = Comment;