const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");
const uuidv4 = require("uuid/v4");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { describe } = require("mocha");
const { description } = require("@hapi/joi/lib/base");
const User = mongoose.model("User");
const OrgRole = mongoose.model("OrgRole");
const UserRoles = mongoose.model("UserRoles");
const { roleConstant, adminRoles, roleProjection } = require("../constants/roleConstant");

function getRolesOfUser(userId) {
    return UserRoles.findOne({ user: userId }).then(role => {
        if (role) {
            let roleIds = role.roles.map(o => o.role);
            let query = { _id: roleIds }; //Select all roles in roleIds
            return OrgRole.find(query).then(data => {
                return {
                    code: 200,
                    data,
                    message: "OK"
                };
            })
                .catch((err) => {
                    return {
                        code: 500,
                        data: [],
                        message: err.message
                    };
                });
        } else {
            return {
                code: 404,
                data: [],
                message: "Role of user not found. It seems there is no role assigned to this user at all."
            };
        }

    })
        .catch((err) => {
            return {
                code: 500,
                data: [],
                message: err.message
            };
        });
};

exports.addRole = (req, res) => {
    OrgRole.findOne({
        $or: [{ code: req.body.code }, { name: req.body.name }],
    }).then((role) => {
        if (!role) {
            const role = new OrgRole({
                code: req.body.code,
                name: req.body.name,
                description: req.body.description,
            });

            role
                .save()
                .then((r) => {
                    //TODO: Add members to the role
                    return res.status(200).json({ message: `The role ${req.body.name} has been created!` });
                })
                .catch((err) => {
                    return res.status(500).json({ message: err.message });
                });
        } else {
            if (role.code === req.body.code) {
                return res.status(409).json({
                    message: "Code of the role exists",
                });
            }
            if (role.name === req.body.name) {
                return res.status(409).json({
                    message: "Name of the role exists",
                });
            }
        }
    });
};

exports.getRolesOfUser = (req, res) => {
    getRolesOfUser(req.body.userId).then(result => {
        console.log("result", result);
        return res.status(result.code).json({
            data: result.data,
            message: result.message
        });
    });
};

exports.getRoles = (req, res) => {
    let query = {}; //Select all roles
    OrgRole.find(query, roleProjection).then(data => {
        return res.status(200).json({ data });
    })
        .catch((err) => {
            console.log("getRoles error", err);
            return res.status(500).json({ message: err.message });
        });
};

//Add an user to specific roles
exports.addMember = (req, res) => {
    UserRoles.findOne({ user: req.body.userId }).then(targetUserRole => {
        if (targetUserRole) {
            let freeRoles = [];
            for (let i = 0; i < req.body.roles.length; i++) {
                let element = req.body.roles[i];
                let fItem = targetUserRole.roles.find(e => {
                    return e.role == element;
                });

                if (!fItem) {
                    freeRoles.push({ role: element });
                }
                if (freeRoles.length > 0) {
                    UserRoles.findByIdAndUpdate(targetUserRole._id,
                        { $push: { roles: freeRoles } },
                        { safe: true, upsert: true, new: true },
                        function (err, model) {
                            if (err) {
                                console.log("1003-addMember error: ", err);
                                return res.status(500).json({ message: err.message });
                            } else {
                                console.log("1000-addMember Success:", model);
                                return res.status(200).json({ message: "Added user to Roles. Free roles:", data: freeRoles });
                            }
                        }
                    ).catch(err => {
                        console.log("1004-addMember error", err);
                        return res.status(500).json({ message: err.message });
                    });
                } else {
                    console.log("1007-addMember Success:", freeRoles);
                    return res.status(200).json({ message: "No roles are added. Free roles:", data: freeRoles });
                }

            }
        } else {
            let addRoles = [];
            for (let i = 0; i < req.body.roles.length; i++) {
                addRoles.push({ role: req.body.roles[i] });
            }

            const newUserRole = new UserRoles({ user: req.body.userId, roles: addRoles });
            newUserRole.save().then(ret => {
                return res.status(200).json({ data: ret });
            }).catch(err => {
                console.log("1005-addMember error", err);
                return res.status(500).json({ message: err.message });
            });
        }
    }).catch(err => {
        console.log("1002-addMember error", err);
        return res.status(500).json({ message: err.message });
    });
};

exports.removeMember = (req, res) => {
    UserRoles.findOne({ user: req.body.userId }).then((targetUserRole) => {
        if (targetUserRole) {

            for (let i = 0; i < req.body.roles.length; i++) {
                let element = req.body.roles[i];
                let fItem = targetUserRole.roles.find(e => {
                    return e.role == element;
                });

                if (fItem) {
                    targetUserRole.roles.pull(fItem);
                }
            }

            targetUserRole.save().then(rt => {
                return res.status(200).json({ message: "Roles are removed. Remaining roles:", data: targetUserRole });
            }).catch(err => {
                return res.status(500).json({ message: err.message });
            });
        } else {
            return res.status(4 - 4).json({ message: "Target user role not found!" });
        }
    }).catch(err => {
        return res.status(500).json({ message: err.message });
    });
};

exports.seedRoles = (req, res) => {

    const roles = [{ code: "SYSTEM-ADMIN", name: "System Administrators", description: "System Administrator role" },
    { code: "ORG-ADMIN", name: "Organization Admins", description: "Organization Administrator role" },
    { code: "CLASS-ADMIN", name: "Class Admins", description: "Class Administrator role" },
    { code: "CLASS-CONTRIBUTOR", name: "Class Contributors", description: "Class Contributor role" },
    { code: "MEMBER", name: "Registered Users", description: "Registered User role" }
    ];
    // Prevent additional documents from being inserted if one fails
    const options = { ordered: true };

    OrgRole.insertMany(roles, options).then(ret => {
        console.log(`${ret.insertedCount} documents were inserted`);
        return res.status(200).json(ret);
    }).catch(err => {
        console.log(`ERROR: ${err}`);
        return res.status(500).json({ message: err.message });
    });

}