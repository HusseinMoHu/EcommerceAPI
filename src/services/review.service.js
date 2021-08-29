// Utils
import catchAsync from '../utils/catchAsync';
import APIFeatures from '../utils/apiFeatures';

// Models
import { Review } from '../models/index';

/**
 * Create New Review
 * @param   {Object} body
 * @returns {Object<type|message|statusCode|review>}
 */
export const createReview = catchAsync(async (product, user, body) => {
  const { review, rating } = body;

  // 1) Check If User Entered All Fields
  if (!review || !rating) {
    return {
      type: 'Error',
      message: 'fieldsRequired',
      statusCode: 400
    };
  }

  // 2) Create Review
  const newReview = await Review.create({
    product,
    user,
    review,
    rating
  });

  // 3) If Everything is OK, Send Review
  return {
    type: 'Success',
    message: 'successfulReviewCreate',
    statusCode: 201,
    newReview
  };
});

/**
 * Query All Reviews
 * @param   {Object} req
 * @returns {Object<type|message|statusCode|reviews>}
 */
export const queryReviews = catchAsync(async (req) => {
  // 1) Get All Reviews
  const reviews = await APIFeatures(req, Review);

  // 2) Check if Reviews Doesn't Exist
  if (reviews.length === 0) {
    return {
      type: 'Error',
      message: 'noReviewsFound',
      statusCode: 404
    };
  }

  // 3) If Everything is OK, Send Reviews
  return {
    type: 'Success',
    message: 'successfulReviewsFound',
    statusCode: 200,
    reviews
  };
});

/**
 * Query Review Using It's ID
 * @param   {ObjectId} id
 * @returns {Object<type|message|statusCode|review>}
 */
export const queryReviewById = catchAsync(async (id) => {
  // 1) Get Review Using It's ID
  const review = await Review.findById(id);

  // 2) Check If Review Doesn't Exist
  if (!review) {
    return {
      type: 'Error',
      message: 'noReviewFound',
      statusCode: 404
    };
  }

  // 3) If Everything is OK, Send Review
  return {
    type: 'Success',
    message: 'successfulReviewFound',
    statusCode: 200,
    review
  };
});

/**
 * Update Review Using It's ID
 * @param   {ObjectId} id
 * @param   {Object} body
 * @returns {Object<type|message|statusCode|review>}
 */
export const updateReview = catchAsync(async (user, id, body) => {
  // 1) Get Review Document Using It's ID
  const review = await Review.findById(id);

  // 2) Check If Review Doesn't Exist
  if (!review) {
    return {
      type: 'Error',
      message: 'noReviewFound',
      statusCode: 404
    };
  }

  if (user._id !== review.user) {
    return {
      type: 'Error',
      statusCode: 400,
      message: 'notReviewCreator'
    };
  }

  // 3) Update Review
  const result = await Review.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  // 4) If Everything is OK, Send Result
  return {
    type: 'Success',
    message: 'successfulReviewUpdate',
    statusCode: 200,
    result
  };
});

/**
 * Delete Review Using It's ID
 * @param   {ObjectId} id
 * @returns   {Object<type|message|statusCode>}
 */
export const deleteReview = catchAsync(async (user, id) => {
  // 1) Get Review Using It's ID
  const review = await Review.findById(id);

  // 2) Check If Review Already Exist
  if (!review) {
    return {
      type: 'Error',
      message: 'noReviewFound',
      statusCode: 404
    };
  }

  if (user._id !== review.user) {
    return {
      type: 'Error',
      statusCode: 400,
      message: 'notReviewCreator'
    };
  }

  // 3) Delete Review
  await Review.findByIdAndDelete(id);

  // 4) If Everything is OK, Send Message
  return {
    type: 'Success',
    message: 'successfulReviewDelete',
    statusCode: 200
  };
});
