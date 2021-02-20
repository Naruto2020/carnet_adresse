// initialisation du routeur express
const express = require("express");
const router = express.Router();

// import controllers 
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const uploadController = require("../controllers/uploadController");

// import multer 
const multer = require("multer");
const upload = multer();

/** *** **** ****  CRUD *** *** *** */

// create users 
router.post("/register", authController.singUp);
router.post("/login", authController.singIn);
router.get("/logout", authController.logout);

// display all users 
router.get("/", userController.getAllUsers);
// display user by id
router.get("/:id", userController.userInfo);
// update user
router.put("/:id", userController.editUser);
// dellete user 
router.delete("/:id", userController.deleteUser);

// set friends request 
router.patch("/follow/:id", userController.followUser);
router.patch("/unfollow/:id", userController.unfollowUser);

// upload img 
router.post("/upload", upload.single("file") , uploadController.uploadProfil);





module.exports = router;