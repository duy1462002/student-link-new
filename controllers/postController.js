const mongoose = require("mongoose");
const fs = require("fs");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const PostLike = mongoose.model("PostLike");
const Notification = mongoose.model("Notification");
const Comment = mongoose.model("Comment");
const Jimp = require("jimp");
const path = require("path");
const uuidv4 = require("uuid/v4");
const multer = require("multer");
const notificationHandler = require("../handlers/notificationHandler");
const linkify = require("linkifyjs");
require("linkifyjs/plugins/hashtag")(linkify);
require("linkifyjs/plugins/mention")(linkify);

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
// function checkFileType(file, cb) {
//   // Allowed ext
//   const filetypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/; // Include document extensions
//   // Check ext
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   // Check mime
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb(new Error("Only images and documents are allowed"));
//   }
// }

function arrayRemove(array, value) {
  return array.filter((item) => {
    return item._id.toString() !== value.toString();
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destinationPath;
    if (file.mimetype.startsWith('image/')) {
      destinationPath = path.join(__dirname, '..', 'public', 'images', 'post-images');
    } else {
      destinationPath = path.join(__dirname, '..', 'public', 'documents');
    }
    
    // Kiểm tra xem thư mục có tồn tại không, nếu không, tạo nó
    fs.mkdir(destinationPath, { recursive: true }, (err) => {
      if (err) throw err;
      cb(null, destinationPath);
    });
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const filename = `${timestamp}${ext}`;
    cb(null, filename);
  }
});

// Khởi tạo Multer với cấu hình lưu trữ
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // giới hạn kích thước tệp: 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/', 'application/pdf', 'text/plain', 
                          'application/msword', 
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (allowedTypes.some(type => file.mimetype.startsWith(type))) {
      cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and documents (txt, doc, docs, docx) are allowed'));
    }
  }
}).fields([
  { name: 'document', maxCount: 1 }, 
  { name: 'photo', maxCount: 1 }   
]);

exports.upload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    console.log(req.files);
    if (!req.files) {
      req.body.photo = null;
      req.body.document = null;
      return next();
    }

    if (req.files.photo) {
      req.body.photo = req.files.photo[0].filename;

      Jimp.read(req.files.photo[0].path, function (err, test) {
        if (err) throw err;
        test
          .scaleToFit(480, Jimp.AUTO, Jimp.RESIZE_BEZIER)
          .quality(50)
          .write(
            "./public/images/post-images/thumbnail/" +
              req.files.photo[0].filename
          );
        next();
      });
    } else {
      req.body.photo = null;
    }

    if (req.files.document) {
      req.body.document = req.files.document[0].filename;
    } else {
      req.body.document = null;
    }

    if (!req.files.photo) {
      next();
    }
  });
};

exports.getPosts = (req, res) => {
  let query;

  if (req.body.initialFetch) {
    query = [
      {
        $facet: {
          posts: [
            {
              $match: {
                //author: { $in: req.body.followings }
                $and: [
                  { author: { $in: req.body.followings } },
                  {
                    $or: [
                      { group: { $exists: true, $eq: null } },
                      { group: { $exists: false } },
                    ],
                  },
                ],
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
                document: 1,
                "author._id": 1,
                "author.username": 1,
                "author.profilePicture": 1,
              },
            },
          ],
          total: [
            // Filter out documents without a price e.g., _id: 7
            {
              $match: {
                author: { $in: req.body.followings },
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
          $and: [
            {
              _id: {
                $lt: mongoose.Types.ObjectId(req.body.lastId),
              },
              author: { $in: req.body.followings },
            },
          ],
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
          document: 1,
          "author._id": 1,
          "author.username": 1,
          "author.profilePicture": 1,
        },
      },
    ];
  }

  Post.aggregate(query)
    .then((data) => {
      if (req.body.initialFetch && !data[0].total.length) {
        data[0].total.push({ _id: null, count: 0 }); //if user has no posts
      }

      res.status(200).json({ data });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ message: err.message });
    });
};

exports.getPostsByHashtag = (req, res) => {
  let query;

  if (req.body.initialFetch) {
    query = [
      {
        $facet: {
          posts: [
            {
              $match: {
                hashtags: req.body.hashtag,
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
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
                document: 1,
                "author._id": 1,
                "author.username": 1,
                "author.profilePicture": 1,
              },
            },
          ],
          total: [
            // Filter out documents without a price e.g., _id: 7
            {
              $match: {
                hashtags: req.body.hashtag,
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
          $and: [
            {
              _id: {
                $lt: mongoose.Types.ObjectId(req.body.lastId),
              },
              hashtags: req.body.hashtag,
            },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
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
          document: 1,
          "author._id": 1,
          "author.username": 1,
          "author.profilePicture": 1,
        },
      },
    ];
  }

  Post.aggregate(query)
    .then((data) => {
      const { posts } = data[0];
      if (!posts.length) {
        return res.status(404).json({ message: "Hashtag not found" });
      }
      res.status(200).json({ data });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

exports.getPostsByLocation = (req, res) => {
  const [lat, lng] = req.body.coordinates.split(",");

  let query;

  if (req.body.initialFetch) {
    query = [
      {
        $facet: {
          posts: [
            {
              $match: {
                "location.coordinates": [parseFloat(lat), parseFloat(lng)],
              },
            },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
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
                document: 1,
                "author._id": 1,
                "author.username": 1,
                "author.profilePicture": 1,
              },
            },
          ],
          total: [
            {
              $match: {
                "location.coordinates": [parseFloat(lat), parseFloat(lng)],
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
          $and: [
            {
              _id: {
                $lt: mongoose.Types.ObjectId(req.body.lastId),
              },
              "location.coordinates": [parseFloat(lat), parseFloat(lng)],
            },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: 10 },
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
          document: 1,
          "author._id": 1,
          "author.username": 1,
          "author.profilePicture": 1,
        },
      },
    ];
  }

  Post.aggregate(query)
    .then((data) => {
      const { posts } = data[0];

      if (!posts.length) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.status(200).json({ data });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

exports.getPost = (req, res) => {
  Post.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.body.postId) } },
    ...postLookup,

    {
      $project: {
        photo: 1,
        createdAt: 1,
        tags: 1,
        location: 1,
        likes: {
          $size: { $arrayElemAt: ["$likes.users_likes", 0] },
        },
        comments: {
          $size: "$comments",
        },
        description: 1,
        document: 1,
        "author._id": 1,
        "author.username": 1,
        "author.profilePicture": 1,
      },
    },
  ])
    .then((post) => {
      if (!post.length) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json({ post });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

exports.createPost = (req, res) => {
  console.log(req.body);
  const hashtags = linkify // find hashtags
    .find(req.body.description)
    .filter((link) => {
      if (link.type === "hashtag") {
        return link.value.substring(1);
      }
    })
    .map((hashtag) => hashtag.value.substring(1));

  const mentions = linkify // find mentions
    .find(req.body.description)
    .filter((link) => {
      if (link.type === "mention") {
        return link.value.substring(1);
      }
    })
    .map((hashtag) => hashtag.value.substring(1));

  const tags = JSON.parse(req.body.tags).map((tag) => tag.value);

  const uniqueUsernames = [...new Set([...mentions, ...tags])];

  let newPost = new Post({
    author: req.userData.userId,
    title: req.body.title,
    description: req.body.description,
    photo: req.body.photo,
    document: req.body.document,
    hashtags: [...new Set(hashtags)], // remove duplicates
    tags: JSON.parse(req.body.tags),
    group: req.body.groupId,
  });

  console.log(newPost);

  if (req.body.coordinates) {
    const coordinates = req.body.coordinates
      .split(",")
      .map((x) => parseFloat(x));
    newPost.location = {
      type: "Point",
      coordinates: coordinates,
      address: req.body.locationName,
    };
  }

  newPost
    .save()
    .then((post) => {
      User.find({ username: { $in: uniqueUsernames } })
        .select("_id")
        .then((userIds) => {
          const removedUserid = arrayRemove(userIds, req.userData.userId);

          if (removedUserid.length) {
            new Notification({
              sender: req.userData.userId,
              receiver: removedUserid,
              type: "post_tagged",
              post: post._id,
            })
              .save()
              .then((notification) => {
                notification
                  .populate("post", "photo")
                  .execPopulate()
                  .then((notification) => {
                    User.findById(req.userData.userId)
                      .select("profilePicture username")
                      .then((user) => {
                        notificationHandler.sendCommentTaggedNotification({
                          req,
                          removedUserid,
                          user,
                          notification: notification.toObject(),
                        });
                      });
                  });
                67;
              })
              .catch((err) => {
                console.log(err);
                res.status(400).json({ message: err.message });
              });
          }
        });

      new PostLike({ post: post._id }).save().then(() => {
        const data = {
          ...post.toObject(),
          author: [
            { username: req.userData.username, profilePicture: "person.png" },
          ],
          likes: 0,
          comments: 0,
        };
        res.status(200).json({ post: data });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.messages });
    });
};

function deletePostPhoto({ photo }) {
  fs.unlink("./public/images/post-images/" + photo, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("removed");
  });

  fs.unlink("./public/images/post-images/thumbnail/" + photo, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("removed");
  });
}

exports.deletePost = (req, res) => {
  Post.findOneAndDelete({ _id: req.body.postId, author: req.userData.userId })
    .then((post) => {
      if (!post) return res.status(401).json({ message: "Failed to delete" });

      deletePostPhoto(post);

      Comment.deleteMany({
        post: mongoose.Types.ObjectId(post._id),
      }).then((docs) => console.log(docs));
      PostLike.findOneAndDelete({
        post: mongoose.Types.ObjectId(post._id),
      }).then(() => console.log("deleted post likes"));
      Notification.deleteMany({
        post: mongoose.Types.ObjectId(post._id),
      }).then(() => console.log("deleted notifications"));

      res.status(200).json({ message: "Deleted", id: post._id });
    })
    .catch((err) => res.status(400).json({ message: err.message }));
};

exports.likePost = (req, res) => {
  PostLike.updateOne(
    {
      post: req.body.postId,
      "users_likes.author": { $ne: req.userData.userId },
    },
    {
      $addToSet: { users_likes: { author: req.userData.userId } },
    }
  ).then((document) => {
    if (document.nModified === 1) {
      let notification;
      if (req.userData.userId !== req.body.authorId) {
        notification = new Notification({
          sender: req.userData.userId,
          receiver: req.body.authorId,
          type: "like_post",
          post: req.body.postId,
        })
          .save()
          .then((notification) => {
            return notification.populate("post", "photo").execPopulate();
          })
          .then((notification) => {
            return notification.toObject();
          });
      }

      const user = User.findByIdAndUpdate(
        req.userData.userId,
        { $push: { postLikes: { post: req.body.postId } } },
        { new: true, upsert: true }
      ).select("profilePicture username");

      Promise.all([user, notification])
        .then((values) => {
          notificationHandler.sendLikePostNotification(req, values);
          return res
            .status(200)
            .json({ postId: req.body.postId, action: "liked" });
        })
        .catch((err) => console.log(err));
    } else {
      const postLike = PostLike.updateOne(
        { post: req.body.postId },
        {
          $pull: { users_likes: { author: req.userData.userId } },
        },
        { new: true, upsert: true }
      );

      const user = User.findByIdAndUpdate(
        req.userData.userId,
        { $pull: { postLikes: { post: req.body.postId } } },
        { new: true, upsert: true }
      );

      Promise.all([postLike, user])
        .then((values) => {
          return res
            .status(200)
            .json({ postId: req.body.postId, action: "disliked" });
        })
        .catch((err) => console.log(err));
    }
  });
};

exports.getPostLikes = (req, res) => {
  PostLike.find({ post: req.body.postId })
    .populate("users_likes.author", "username profilePicture")
    .then((users) => {
      res.status(200).json({ users });
    });
};
