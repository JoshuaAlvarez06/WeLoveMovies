const router = require("express").Router();
const knex = require("../db/connection");
const methodNotAllowed = require("../errors/methodNotAllowed");
const controller = require("./theaters.controller");


router
    .route("/")
    .get(controller.list)
    .all(methodNotAllowed);

module.exports = router;