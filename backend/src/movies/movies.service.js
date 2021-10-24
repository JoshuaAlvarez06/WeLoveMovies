const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

const addCritic = mapProperties({
    critic_id: "critic.critic_id",
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",
});

function list() {
    return knex("movies")
        .select("*");
};

function listShowing() {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        //SELECT distinct
        .distinct("m.*")
        .where({"mt.is_showing": true})
        .orderBy("m.movie_id")
};

function read(movieId) {
    return knex("movies")
        .select("*")
        .where({ "movie_id": movieId })
        .first();
};

function readTheaters(movieId) {
    return knex("movies_theaters as mt")
        .join("theaters as t", "mt.theater_id", "t.theater_id")
        //Same as SELECT distinct
        .select("t.*")
        .where({ "mt.movie_id": movieId })
};

function readReviews(movieId) {
    return knex("reviews as r")
        .join("critics as c", "r.critic_id", "c.critic_id")
        .select("*")
        .where({ "r.movie_id": movieId })
        //Loop through the reviews and addCritic to each review
        .then((reviews) => reviews.map(review => addCritic(review)));
};

module.exports = {
    list,
    listShowing,
    read,
    readTheaters,
    readReviews,
};