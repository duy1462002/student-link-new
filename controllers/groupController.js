const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");
const uuidv4 = require("uuid/v4");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = mongoose.model("User");
const Group = mongoose.model("Group");
const Post = mongoose.model("Post");
const notificationHandler = require("../handlers/notificationHandler");

const postLookup = [
    {
        $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
        },
    },
    {
        $lookup: {
            from: "postlikes",
            localField: "_id",
            foreignField: "post",
            as: "likes",
        },
    },
    {
        $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "post",
            as: "comments",
        },
    },
];

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Only images are allowed"));
    }
}

const storage = multer.diskStorage({
    //multers disk storage settings
    destination: (req, file, cb) => {
        cb(null, "./public/images/group-images/");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];

        cb(null, uuidv4() + "." + ext);
    },
});

const upload = multer({
    //multer settings
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
    limits: {
        fileSize: 10485760, //10 MB
    },
}).single("photo");

function addMemberToGroup(req) {
    return Group.findById({ _id: req.body.groupId })
        .then((foundGroup) => {
            if (!foundGroup) {
                return {
                    code: 404,
                    message: `The group ${req.body.groupId} not found!`
                };
            }

            let isOwner = foundGroup.owner == req.userData.userId;

            if (!isOwner && foundGroup.members && !foundGroup.members.find((item) => item.user == req.userData.userId)) {
                return {
                    code: 403,
                    message: `The user ${req.userData.userId} does not have permission to add member in the group ${req.body.groupId}!`
                };
            }

            if (foundGroup.members && foundGroup.members.find((item) => item.user == req.body.memberId)) {
                return {
                    code: 409,
                    message: `The user ${req.body.memberId} does existed in the group ${req.body.groupId}!`
                };
            }

            const groups = Group.updateOne(
                {
                    _id: req.body.groupId,
                },
                {
                    $addToSet: { members: { user: req.body.memberId } },
                }
            );

            const users = User.updateOne(
                {
                    _id: req.body.memberId
                },
                {
                    $addToSet: { groups: { group: req.body.groupId } },
                }
            );

            return Promise.all([groups, users])
                .then(() => {
                    return {
                        code: 200,
                        groupId: req.body.groupId,
                        memberId: req.body.memberId,
                        action: "added",
                        message: "OK"
                    };
                })
                .catch((err) => {
                    console.log(err);
                    return {
                        code: 500,
                        message: `Cannot add the user ${req.body.userId} into group ${req.body.groupId}!`,
                        message: "OK"
                    };
                });
        });
}

function deleteMemberFromGroup(req) {
    return Group.findById({ _id: req.body.groupId })
        .then((foundGroup) => {
            if (!foundGroup) {
                return {
                    code: 404,
                    message: `The group ${req.body.groupId} not found!`
                };
            }

            let isOwner = foundGroup.owner == req.userData.userId;

            if (!isOwner && foundGroup.members && !foundGroup.members.find((item) => item.user == req.userData.userId)) {
                return {
                    code: 403,
                    message: `The user ${req.userData.userId} does not have permission to delete member from the group ${req.body.groupId}!`
                };
            }

            if (!foundGroup.members || !foundGroup.members.find((item) => item.user == req.body.memberId)) {
                return {
                    code: 404,
                    message: `The user ${req.body.memberId} does not exist in the group ${req.body.groupId}!`
                };
            }

            const groups = Group.updateOne(
                {
                    _id: req.body.groupId,
                },
                {
                    $pull: { members: { user: req.body.memberId } },
                }
            );

            const users = User.updateOne(
                {
                    _id: req.body.memberId
                },
                {
                    $pull: { groups: { group: req.body.groupId } },
                }
            );

            return Promise.all([groups, users])
                .then(() => {
                    return {
                        code: 200,
                        groupId: req.body.groupId,
                        memberId: req.body.memberId,
                        action: "deleted",
                        message: "OK"
                    };
                })
                .catch((err) => {
                    console.log(err);
                    return {
                        code: 500,
                        message: `Cannot delete the user ${req.body.memberId} from the group ${req.body.groupId}!`
                    };
                });
        });
}

function addAdminToGroup(req) {
    return Group.findById({ _id: req.body.groupId })
        .then((foundGroup) => {
            if (!foundGroup) {
                return {
                    code: 404,
                    message: `The group ${req.body.groupId} not found!`
                };
            }

            let isAuthorized =
                foundGroup.owner == req.userData.userId ||
                foundGroup.admins.find((admin) => admin.userId == req.userData.userId);

            if (!isAuthorized) {
                return {
                    code: 403,
                    message: `The user ${req.userData.userId} does not have permission to add admins to the group ${req.body.groupId}!`
                };
            }

            if (foundGroup.admins.find((admin) => admin.userId == req.body.memberId)) {
                return {
                    code: 409,
                    message: `The user ${req.body.memberId} is already an admin of the group ${req.body.groupId}!`
                };
            }

            return Group.updateOne(
                { _id: req.body.groupId },
                { $addToSet: { admins: { userId: req.body.memberId } } }
            )
                .then(() => {
                    return {
                        code: 200,
                        groupId: req.body.groupId,
                        memberId: req.body.memberId,
                        action: "added",
                        message: "Admin added successfully!"
                    };
                })
                .catch((err) => {
                    console.error(err);
                    return {
                        code: 500,
                        message: `Cannot add the user ${req.body.memberId} as an admin to the group ${req.body.groupId}!`
                    };
                });
        });
}

function removeAdminFromGroup(req) {
    return Group.findById({ _id: req.body.groupId })
        .then((foundGroup) => {
            if (!foundGroup) {
                return {
                    code: 404,
                    message: `The group ${req.body.groupId} not found!`
                };
            }

            let isAuthorized =
                foundGroup.owner == req.userData.userId ||
                foundGroup.admins.find((admin) => admin.userId == req.userData.userId);

            if (!isAuthorized) {
                return {
                    code: 403,
                    message: `The user ${req.userData.userId} does not have permission to remove admins from the group ${req.body.groupId}!`
                };
            }

            if (!foundGroup.admins.find((admin) => admin.userId == req.body.memberId)) {
                return {
                    code: 409,
                    message: `The user ${req.body.memberId} is not an admin of the group ${req.body.groupId}!`
                };
            }

            // Prevent owner from being removed as admin
            if (foundGroup.owner == req.body.memberId) {
                return {
                    code: 403,
                    message: `The owner of the group ${req.body.groupId} cannot be removed as an admin!`
                };
            }

            return Group.updateOne(
                { _id: req.body.groupId },
                { $pull: { admins: { userId: req.body.memberId } } }
            )
                .then(() => {
                    return {
                        code: 200,
                        groupId: req.body.groupId,
                        memberId: req.body.memberId,
                        action: "removed",
                        message: "Admin removed successfully!"
                    };
                })
                .catch((err) => {
                    console.error(err);
                    return {
                        code: 500,
                        message: `Cannot remove the user ${req.body.memberId} as an admin from the group ${req.body.groupId}!`
                    };
                });
        });
}



exports.upload = async (req, res, next) => {
    upload(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message });

        if (!req.file)
            return res.status(400).json({ message: "Please upload a file" });

        req.body.photo = req.file.filename;
        Jimp.read(req.file.path, function (err, test) {
            if (err) throw err;
            test
                .scaleToFit(480, Jimp.AUTO, Jimp.RESIZE_BEZIER)
                .quality(50)
                .write("./public/images/group-images/thumbnail/" + req.body.photo);
            next();
        });
    });
};

exports.createGroup = (req, res) => {
    Group.findOne({
        $or: [{ hashtag: req.body.hashtag }, { name: req.body.name }],
    }).then((foundGroup) => {
        if (foundGroup) {
            return res.status(409).json({ message: "Duplicated Group hashtag or name" });
        }
        const group = new Group({
            owner: req.userData.userId,
            //user: req.userData.userId,
            //members: req.body.memberIds,
            coverImage: req.body.photo,
            hashtag: req.body.hashtag,
            name: req.body.name,
            description: req.body.description,
            rules: req.body.rules,
            admins: [req.userData]
        });

        group
            .save()
            .then((g) => {
                notificationHandler.sendNewGroupCreated({ req, g });

                //Create member for the current user
                let rq = {
                    userData: req.userData,
                    body: {
                        groupId: g._id,
                        memberId: req.userData.userId
                    }
                };

                let result = null;

                addMemberToGroup(rq).then((ret) => {
                    console.log("Add user result: ", ret);
                    result = ret;
                    if (result.code === 200) {
                        //add group success then add members
                        req.body.memberIds.forEach(element => {
                            let rq = {
                                userData: req.userData,
                                body: {
                                    groupId: g._id,
                                    memberId: element
                                }
                            };

                            addMemberToGroup(rq).then((ret) => {
                                result = ret;
                                console.log("Add member result: ", ret);
                            });
                        });
                    }

                });

                return res.status(200).json({ message: `The group ${req.body.name} has been created!` });
            })
            .catch((err) => {
                return res.status(500).json({ message: err.message });
            });
    });
};

exports.addGroupMember = (req, res) => {
    addMemberToGroup(req).then(result => {
        console.log(result);
        return res.status(result.code).json({ message: result.message });
    });
};

exports.deleteGroupMember = (req, res) => {
    deleteMemberFromGroup(req).then(result => {
        console.log(result);
        return res.status(result.code).json({ message: result.message });
    });
};

exports.addGroupAdmin = (req, res) => {
    addAdminToGroup(req)
        .then((result) => {
            console.log(result);
            return res.status(result.code).json({ message: result.message });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        });
};

exports.removeGroupAdmin = (req, res) => {
    removeAdminFromGroup(req)
        .then((result) => {
            console.log(result);
            return res.status(result.code).json({ message: result.message });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        });
};

exports.getGroupDetail = (req, res) => {
    //const userId = req.userData.userId;
    const groupId = req.body.groupId;

    Group.findById({ _id: groupId }).then(data => {
        return res.status(200).json(data);
    }).catch(err => {
        return res.status(500).json({ message: err.message });
    });
};

exports.getPosts = (req, res) => {
    let query;
    let id = mongoose.Types.ObjectId(req.body.groupId);

    if (req.body.initialFetch) {
        query = [
            {
                $facet: {
                    posts: [
                        {
                            $match: {
                                group: { $exists: true, $eq: id }
                            },
                        },
                        { $sort: { createdAt: -1 } },
                        { $limit: 5 },
                        ...postLookup,
                        {
                            $project: {
                                photo: 1,
                                createdAt: 1,
                                tags: 1,
                                hashtags: 1,
                                location: 1,
                                likes: {
                                    $size: { $arrayElemAt: ["$likes.users_likes", 0] },
                                },
                                comments: {
                                    $size: "$comments",
                                },
                                description: 1,
                                "author._id": 1,
                                "author.username": 1,
                                "author.profilePicture": 1,
                                document: 1
                            },
                        },
                    ],
                    total: [
                        // Filter out documents has group id match with given value
                        {
                            $match: {
                                group: { $exists: true, $eq: id },
                            },
                        },
                        { $group: { _id: null, count: { $sum: 1 } } },
                    ],
                },
            },
        ];
    } else {
        query = [
            {
                $match: {
                    group: { $exists: true, $eq: id },
                },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            ...postLookup,

            {
                $project: {
                    photo: 1,
                    createdAt: 1,
                    tags: 1,
                    hashtags: 1,
                    location: 1,
                    likes: {
                        $size: { $arrayElemAt: ["$likes.users_likes", 0] },
                    },
                    comments: {
                        $size: "$comments",
                    },
                    description: 1,
                    "author._id": 1,
                    "author.username": 1,
                    "author.profilePicture": 1,
                    document: 1
                },
            },
        ];
    }

    Post.aggregate(query)
        .then((data) => {
            if (req.body.initialFetch && !data[0].total.length) {
                data[0].total.push({ _id: null, count: 0 }); //if user has no posts
            }
            console.log({ message: "OK", data });
            res.status(200).json({ message: "OK", data });
        })
        .catch((err) => {
            console.log(err.message);
            res.status(500).json({ message: err.message });
        });
};

exports.updateGroup = (req, res) => {
    const filter = { _id: req.body.groupId };
    const update = {
        name: req.body.name,
        description: req.body.description,
        rules: req.body.rules,
    }

    Group.findOneAndUpdate(filter, update).then((data) => {
        return res.status(200).json(data);
    }).catch(err => {
        return res.status(500).json({ message: err.message });
    });
};

exports.changeCover = (req, res) => {
    const filter = { _id: req.body.groupId };
    const update = {
        coverImage: req.body.photo
    }

    Group.findOneAndUpdate(filter, update).then((data) => {
        return res.status(200).json(data);
    }).catch(err => {
        return res.status(500).json({ message: err.message });
    });
};

exports.getGroupMembers = (req, res) => {
    let groupId = mongoose.Types.ObjectId(req.body.groupId);
    let members = req.body.members;

    Group.findById(groupId)
        .then(group => {
            if (!group) {
                return res.status(404).json({ message: "Group not found" });
            }
            let groupOwner = group.owner;

            return User.find(
                { _id: { $in: members }, "groups.group": groupId },
                {
                    username: 1,
                    profilePicture: 1,
                    firstName: 1,
                    lastName: 1,
                }
            ).then(data => {
                return res.status(200).json({
                    message: "OK",
                    data,
                    groupOwner
                });
            });
        })
        .catch(err => {
            return res.status(500).json({ message: err.message });
        });
};
