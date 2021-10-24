const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
});

function read(reviewId) {
    return knex("reviews")
        .select("*")
        .where({ "review_id" : reviewId })
        .first();
}

function destroy(reviewId) {
    return knex("reviews")
        .where({ "review_id": reviewId })
        .del();
}

function update(reviewId, updatedReview){
    return knex("reviews")
        .where({ review_id: reviewId})
        .update(updatedReview);
}

//Read review with nested critic
function reviewWithCritic(reviewId) {
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("*")
        .where({ "review_id": reviewId })
        .first()
        .then(addCritic);
}

module.exports = {
    read,
    delete: destroy,
    update,
    reviewWithCritic,
};