const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Comment = require("../models/comment");
const CommentLike = require("../models/commentLike");
const { findByIdAndDelete } = require("../models/postLike");

module.exports.create_comment = [
  body("comment")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Error, no puede escribir un comentario vacio"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const comment = new Comment({
      content: req.body.comment,
      user: req.body.userId,
      post: req.body.postId,
    });

    if (!errors.isEmpty()) {
      res.status(400).json({ error: errors.mapped().comment });
    } else {
      await comment.save();
      res.status(200).json({
        message: "Comentario guardado",
        user: {
          ...res.locals.currentUser._doc,
          url: res.locals.currentUser.url,
        },
        comment: { ...comment._doc, formatted_date: comment.formatted_date },
      });
    }
  }),
];

module.exports.delete_comment = async (req, res, next) => {
  try {
    await Comment.findByIdAndDelete(req.params.id).exec();
    res.status(200).json({ message: "Comment deleted succesfully" });
  } catch (error) {
    res.status(400).json({ message: `Error when deleting post: ${error}` });
  }
};

// upvotes comment
module.exports.upvote_comment = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const [comment, oldLike] = await Promise.all([
        Comment.findById(req.body.comment_id).session(session).exec(),
        CommentLike.findOne({ comment: req.body.comment_id, user: req.user.id })
          .session(session)
          .exec(),
      ]);

      if (!comment) {
        // Comment to like not found
        const err = new Error("The comment was not found");
        throw err;
      }
      if (oldLike) {
        if (oldLike.is_positive_like) {
          // User wants to remove upvote
          comment.points -= 1;
          await Promise.all([
            CommentLike.findByIdAndDelete(oldLike.id),
            comment.save(),
          ]);
          res.status(200).json({
            message: "Upvote removed successfully",
            points: comment.points,
          });
          return Promise.resolve(true);
        }
        // user wants to change from downvote to upvote
        comment.points += 2;
        oldLike.is_positive_like = true;
        await Promise.all([comment.save(), oldLike.save()]);
        res.status(200).json({
          message: "Upvote changed to downvote successfully",
          points: comment.points,
        });
        return Promise.resolve(true);
      }
      // User first like to this comment is a upvote
      comment.points += 1;
      const like = new CommentLike({
        user: req.user.id,
        comment: req.body.comment_id,
        is_positive_like: true,
      });
      await Promise.all([comment.save(), like.save()]);
      res.status(200).json({
        message: "Comment upvoted successfully",
        points: comment.points,
      });
      return Promise.resolve(true);
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: `Error, could not upvote post because: ${error}` });
    return Promise.resolve(false);
  } finally {
    session.endSession();
  }
};

module.exports.downvote_comment = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const [comment, oldLike] = await Promise.all([
        Comment.findById(req.body.comment_id).session(session).exec(),
        CommentLike.findOne({
          user: req.user.id,
          comment: req.body.comment_id,
        })
          .session(session)
          .exec(),
      ]);
      if (!comment) {
        // Comment to upvote not found
        const err = new Error("Error, could not find the comment to downvote");
        throw err;
      }
      if (oldLike) {
        if (!oldLike.is_positive_like) {
          // User wants to remove downvote
          comment.points += 1;
          await Promise.all([
            comment.save(),
            CommentLike.findByIdAndDelete(oldLike.id),
          ]);
          res.status(200).json({
            message: "Downvote removed successfully",
            points: comment.points,
          });
          return Promise.resolve(true);
        }
        // User wants to change from upvote to downvote
        comment.points -= 2;
        oldLike.is_positive_like = false;
        await Promise.all([comment.save(), oldLike.save()]);
        res.status(200).json({
          message: "Downvote changed to upvote successfully",
          points: comment.points,
        });
        return Promise.resolve(true);
      }
      // User is making like on comment for the first time
      comment.points -= 1;
      const like = new CommentLike({
        user: req.user.id,
        comment: req.body.comment_id,
        is_positive_like: false,
      });
      await Promise.all([comment.save(), like.save()]);
      res.status(200).json({
        message: "Comment downvoted successfully",
        points: comment.points,
      });
      return Promise.resolve(true);
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: `Error could not downvote comment because: ${error}` });
    return Promise.resolve(false);
  } finally {
    session.endSession();
  }
};
