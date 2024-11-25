const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const checkAuth = require("../middleware/checkAuth");
const roleValidator = require("../middleware/schemaValidators/roleValidator");
router.post(
    "/addRole",
    checkAuth,
    roleController.addRole
);

router.post(
    "/addMember",
    checkAuth,
    roleValidator.addRemoveMember,
    roleController.addMember
);

router.post(
    "/removeMember",
    checkAuth,
    roleValidator.addRemoveMember,
    roleController.removeMember
);

router.post(
    "/getRoles",
    checkAuth,
    roleValidator.getRoles,
    roleController.getRoles
);

router.post(
    "/getRolesOfUser",
    checkAuth,
    roleValidator.getRolesOfUser,
    roleController.getRolesOfUser
);

router.post(
    "/seedRoles",
    checkAuth,
    roleController.seedRoles
);

module.exports = router;