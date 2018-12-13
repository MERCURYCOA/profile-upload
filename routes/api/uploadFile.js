const express = require("express");
const multer = require("multer");
const FileDetail = require("../../models/FileDetail");
const mongoose = require("mongoose");

const router = express.Router();

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

// var upload = multer({ storage: storage })

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // max 5MB file
  }
});

router.post("/uploadFile", upload.single("image"), function(req, res, next) {
  // router.post("/", upload.single("image"), function(req, res, next) {
  // console.log("ghggh",req.file); return false;
  if (req.file == undefined) {
    return res.status(422).send({ error: "You must select a file to upload." });
  }

  const product = new FileDetail({
    _id: new mongoose.Types.ObjectId(),
    // uploader: req.body.uploader,
    uploader: "Ajay",
    filePath: req.file.path,
    fileName: req.file.originalname
  });
  product
    .save()
    // .then(result => {
    .then(result => {
      FileDetail.find({}).exec(function(err, files) {
        if (files) {
          res.status(201).json({
            message: "File uploaded successfully",
            allFilesDetail: files
          });
        } else {
          res.status(204).json({
            message: "No file detail exist",
            allFilesDetail: files
          });
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/getFileDetails", function(req, res) {
  // router.get("/", function(req, res) {
  FileDetail.find({}).exec(function(err, files) {
    if (files) {
      res.status(201).json({
        allFilesDetail: files
      });
    } else {
      res.status(204).json({
        allFilesDetail: files
      });
    }
  });
});
module.exports = router;
