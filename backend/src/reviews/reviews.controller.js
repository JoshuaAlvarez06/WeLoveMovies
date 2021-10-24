const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//Properties valid in request body
const VALID_PROPERTIES = [
    "content",
    "score",
];

async function reviewExists(req, res, next) {
    const { reviewId } = req.params;
    const foundReview = await service.read(reviewId);
    if (foundReview) {
        res.locals.review = foundReview;
        return next();
    }
    return next({
        status: 404,
        message: "Review cannot be found.",
    });
};

function updateBodyIsValid(req, res, next) {
    const { data = {} } = req.body;
    const invalidFields = Object.keys(data).filter(field => !VALID_PROPERTIES.includes(field));
    if (invalidFields.length) {
        return next({ 
            status: 400,
            message: `Invalid field(s): ${invalidFields.join(", ")}`,
        })
    }
    next();
}

async function destroy(req, res) {
    await service.delete(res.locals.review.review_id);
    res.sendStatus(204);
}

async function update(req, res) {
    const { reviewId } = req.params;
    const updatedReview = {
        ...req.body.data
    }
    //Update the review
    await service.update(reviewId, updatedReview)
    //Retrieve and respond with the updated review with the nested critic
    res.json({ data: await service.reviewWithCritic(reviewId) });
}

module.exports = {
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
    update: [asyncErrorBoundary(reviewExists), updateBodyIsValid, asyncErrorBoundary(update)]
};