const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const Group = mongoose.model("Group");

exports.addGroupMember = (req, res, next) => {
    if (req.body && req.body.memberId && req.body.groupId) {
        next();
        return;
    } else {
        return res.status(400).json({ message: "Requested data is invalid!" });
    }
}

exports.deleteGroupMember = (req, res, next) => {
    if (req.body && req.body.memberId && req.body.groupId) {
        next();
        return;
    } else {
        return res.status(400).json({ message: "Requested data is invalid!" });
    }
};

exports.addGroupAdmin = (req, res, next) => {
    if (req.body && req.body.memberId && req.body.groupId) {
        next();
    } else {
        return res.status(400).json({ message: "Requested data is invalid!" });
    }
};

exports.removeGroupAdmin = (req, res, next) => {
    if (req.body && req.body.memberId && req.body.groupId) {
        next();
    } else {
        return res.status(400).json({ message: "Requested data is invalid!" });
    }
};

exports.updateGroup = (req, res, next) => {
    if (req.body && req.body.name && req.body.description && req.body.rules) {
        next();
        return;
    } else {
        return res.status(400).json({ message: "Requested data is invalid!" });
    }
}

exports.changeCover = (req, res, next) => {
    if (req.body && req.body.photo) {
        next();
        return;
    } else {
        return res.status(400).json({ message: "Requested data is invalid!" });
    }
}