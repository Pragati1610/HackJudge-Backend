const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const log = require("console-debug-log");
const Evaluate = require("../models/evaluate");

router.post("/", (req, res) => {
  log.debug(req.body);
  const details = new Evaluate({
    _id: new mongoose.Types.ObjectId(),
    abstract: req.body.abstract,
    link: req.body.link,
    analysis: req.body.analysis,
    review: req.body.review,
    addComments: req.body.addComments,
    metrics: req.body.metrics
  });

  details.save().then(result => {
    log.debug(result);
    res.status(201).send({
      message: "Create details successfully",
      createdProduct: {
        abstract: result.abstract,
        link: result.link,
        analysis: result.analysis,
        review: result.review,
        addComments: result.addComments,
        metrics: result.metrics,
        _id: result._id
      }
    });
  });
});

router.patch("/:evaluateId", (req, res, next) => {
  const id = req.params.detailsId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Evaluate.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "evaluation updated",
        request: {
          type: "GET",
          url: "http://localhost:8080/evaluate/" + id
        }
      });
    })
    .catch(err => {
      log.debug(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;