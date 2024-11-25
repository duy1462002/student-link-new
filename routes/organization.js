const express = require("express");
const router = express.Router();
const organizationController = require("../controllers/organizationController");
const checkAuth = require("../middleware/checkAuth");
const organizationValidator = require("../middleware/schemaValidators/organizationValidator");
router.post(
    "/addOrg",
    checkAuth,
    organizationController.addOrg
);

router.post(
    "/addMember",
    checkAuth,
    organizationValidator.addRemoveMember,
    organizationController.addMember
);

router.post(
    "/removeMember",
    checkAuth,
    organizationValidator.addRemoveMember,
    organizationController.removeMember
);

router.post(
    "/getMembers",
    checkAuth,
    organizationValidator.getMembers,
    organizationController.getMembers
);

router.post(
    "/updateMemberRoles",
    checkAuth,
    organizationValidator.addRemoveMember,
    organizationController.updateMemberRoles
);

router.post(
    "/updateMemberRoles",
    checkAuth,
    organizationValidator.updateOrganization,
    organizationController.updateOrganization
);

module.exports = router;