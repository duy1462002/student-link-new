const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const checkAuth = require("../middleware/checkAuth");
const postValidator = require("../middleware/schemaValidators/postValidator");
const groupValidator = require("../middleware/schemaValidators/groupValidator");

router.post(
    "/addGroup",
    checkAuth,
    groupController.upload,
    groupController.createGroup
);

router.post(
    "/updateGroup",
    checkAuth,
    groupValidator.updateGroup,
    groupController.updateGroup
);

router.post(
    "/changeCover",
    checkAuth,
    groupController.upload,
    groupValidator.changeCover,
    groupController.changeCover
);

router.post(
    "/addMember",
    checkAuth,
    groupValidator.addGroupMember,
    groupController.addGroupMember
);

router.post(
    "/deleteMember",
    checkAuth,
    groupValidator.deleteGroupMember,
    groupController.deleteGroupMember
);

router.post(
    "/addAdmin",
    checkAuth,
    groupValidator.addGroupAdmin, 
    groupController.addGroupAdmin 
);

router.post(
    "/removeAdmin",
    checkAuth,
    groupValidator.removeGroupAdmin, 
    groupController.removeGroupAdmin 
);

router.post(
    "/groupDetail",
    checkAuth,
    groupController.getGroupDetail
);

router.post(
    "/getPosts",
    checkAuth,
    groupController.getPosts
);

router.post(
    "/addPost",
    checkAuth,
    postController.upload,
    postValidator.createPost,
    postController.createPost
  );
  
router.post(
    "/getGroupMembers",
    checkAuth,
    groupController.getGroupMembers
  );
  
module.exports = router;