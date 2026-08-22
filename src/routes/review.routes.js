const express = require("express");

const {
  createReview,
  getReviews,
  getReviewsByfood,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

router.post("/", createReview);

router.get("/", getReviews);

router.get("/food/:foodId", getReviewsByfood);

router.get("/:id", getReviewById);

router.put("/:id", updateReview);

router.delete("/:id", deleteReview);

module.exports = router;