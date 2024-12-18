import React, { Component } from "react";
import { connect } from "react-redux";
import { notificationActions } from "../actions/notificationActions";
import { Feed, Image, Divider, Header } from "semantic-ui-react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function navigateToPost(post) {
  window.location.href = `/p/${post[0]._id}`;
}

function navigateToLink(link) {
  window.location.href = link;
}

function postLikeNotification({ _id, createdAt, sender, post }) {
  return (
    <Feed.Event
      onClick={() => {
        navigateToPost(post);
      }}
      key={_id}
    >
      <Feed.Label
        image={`/images/profile-picture/100x100/${sender[0].profilePicture}`}
      />
      <Feed.Content>
        <Feed.Summary>
          <Feed.User as={Link} to={"/" + sender[0].username}>
            {sender[0].username}
          </Feed.User>{" "}
          <span style={{ fontWeight: "normal" }}>liked your</span>{" "}
          <Link to={`/p/${post[0]._id}`}>post</Link>
          <Feed.Date>{dayjs(createdAt).fromNow()}</Feed.Date>
        </Feed.Summary>
        <Feed.Extra images>
          <Link to={`/p/${post[0]._id}`}>
            <Image
              rounded
              src={`/images/post-images/thumbnail/${post[0].photo}`}
            />
          </Link>
        </Feed.Extra>
      </Feed.Content>
    </Feed.Event>
  );
}

function commentLikeNotification({ _id, createdAt, sender, comment, post }) {
  return (
    <Feed.Event
      onClick={() => {
        navigateToPost(post);
      }}
      key={_id}
    >
      <Feed.Label
        image={`/images/profile-picture/100x100/${sender[0].profilePicture}`}
      />
      <Feed.Content>
        <Feed.Summary>
          <Feed.User as={Link} to={"/" + sender[0].username}>
            {sender[0].username}
          </Feed.User>{" "}
          <span style={{ fontWeight: "normal" }}>liked your comment</span>{" "}
          {comment[0].text} <span style={{ fontWeight: "normal" }}>on</span>{" "}
          <Link to={`/p/${post[0]._id}`}>post</Link>
          <Feed.Date>{dayjs(createdAt).fromNow()}</Feed.Date>
        </Feed.Summary>
        <Feed.Extra images>
          <Link to={`/p/${post[0]._id}`}>
            <Image
              rounded
              src={`/images/post-images/thumbnail/${post[0].photo}`}
            />
          </Link>
        </Feed.Extra>
      </Feed.Content>
    </Feed.Event>
  );
}

function likeCommentReplyNotification({ _id, createdAt, sender, reply, post }) {
  return (
    <Feed.Event
      onClick={() => {
        navigateToPost(post);
      }}
      key={_id}
    >
      <Feed.Label
        image={`/images/profile-picture/100x100/${sender[0].profilePicture}`}
      />
      <Feed.Content>
        <Feed.Summary>
          <Feed.User as={Link} to={"/" + sender[0].username}>
            {sender[0].username}
          </Feed.User>{" "}
          <span style={{ fontWeight: "normal" }}>liked your reply</span>{" "}
          {reply[0].text} <span style={{ fontWeight: "normal" }}>on</span>{" "}
          <Link to={`/p/${post[0]._id}`}>post</Link>
          <Feed.Date>{dayjs(createdAt).fromNow()}</Feed.Date>
        </Feed.Summary>
        <Feed.Extra images>
          <Link to={`/p/${post[0]._id}`}>
            <Image
              rounded
              src={`/images/post-images/thumbnail/${post[0].photo}`}
            />
          </Link>
        </Feed.Extra>
      </Feed.Content>
    </Feed.Event>
  );
}

function postTaggedNotification({ _id, createdAt, sender, post }) {
  return (
    <Feed.Event
      onClick={() => {
        navigateToPost(post);
      }}
      key={_id}
    >
      <Feed.Label
        image={`/images/profile-picture/100x100/${sender[0].profilePicture}`}
      />
      <Feed.Content>
        <Feed.Summary>
          <Feed.User as={Link} to={"/" + sender[0].username}>
            {sender[0].username}
          </Feed.User>{" "}
          <span style={{ fontWeight: "normal" }}> tagged you on</span>{" "}
          <Link to={`/p/${post[0]._id}`}>post</Link>
          <Feed.Date>{dayjs(createdAt).fromNow()}</Feed.Date>
        </Feed.Summary>
        <Feed.Extra images>
          <Link to={`/p/${post[0]._id}`}>
            <Image
              rounded
              src={`/images/post-images/thumbnail/${post[0].photo}`}
            />
          </Link>
        </Feed.Extra>
      </Feed.Content>
    </Feed.Event>
  );
}

function commentTaggedNotification({ _id, createdAt, sender, post }) {
  return (
    <Feed.Event
      onClick={() => {
        navigateToPost(post);
      }}
      key={_id}
    >
      <Feed.Label
        image={`/images/profile-picture/100x100/${sender[0].profilePicture}`}
      />
      <Feed.Content>
        <Feed.Summary>
          <Feed.User as={Link} to={"/" + sender[0].username}>
            {sender[0].username}
          </Feed.User>{" "}
          <span style={{ fontWeight: "normal" }}>mentioned you on</span>{" "}
          <Link to={`/p/${post[0]._id}`}>post</Link>
          <Feed.Date>{dayjs(createdAt).fromNow()}</Feed.Date>
        </Feed.Summary>
        <Feed.Extra images>
          <Link to={`/p/${post[0]._id}`}>
            <Image
              rounded
              src={`/images/post-images/thumbnail/${post[0].photo}`}
            />
          </Link>
        </Feed.Extra>
      </Feed.Content>
    </Feed.Event>
  );
}

function addCommentNotification({ _id, createdAt, sender, comment, post }) {
  return (
    <Feed.Event
      onClick={() => {
        navigateToPost(post);
      }}
      key={_id}
    >
      <Feed.Label
        image={`/images/profile-picture/100x100/${sender[0].profilePicture}`}
      />
      <Feed.Content>
        <Feed.Summary>
          <Feed.User as={Link} to={"/" + sender[0].username}>
            {sender[0].username}
          </Feed.User>{" "}
          <span style={{ fontWeight: "normal" }}>commented</span>{" "}
          {comment[0].text} <span style={{ fontWeight: "normal" }}>on</span>{" "}
          <Link to={`/p/${post[0]._id}`}>post</Link>
          <Feed.Date>{dayjs(createdAt).fromNow()}</Feed.Date>
        </Feed.Summary>
        <Feed.Extra images>
          <Link to={`/p/${post[0]._id}`}>
            <Image
              rounded
              src={`/images/post-images/thumbnail/${post[0].photo}`}
            />
          </Link>
        </Feed.Extra>
      </Feed.Content>
    </Feed.Event>
  );
}

function followNotification({ _id, createdAt, sender }) {
  return (
    <Feed.Event key={_id}>
      <Feed.Label
        image={`/images/profile-picture/100x100/${sender[0].profilePicture}`}
      />
      <Feed.Content>
        <Feed.Summary>
          <Feed.User as={Link} to={"/" + sender[0].username}>
            {sender[0].username}
          </Feed.User>{" "}
          <span style={{ fontWeight: "normal" }}>followed you</span>
          <Feed.Date>{dayjs(createdAt).fromNow()}</Feed.Date>
        </Feed.Summary>
      </Feed.Content>
    </Feed.Event>
  );
}

function commentReplyNotification({
  _id,
  createdAt,
  post,
  sender,
  reply,
  comment,
}) {
  return (
    <Feed.Event
      onClick={() => {
        navigateToPost(post);
      }}
      key={_id}
    >
      <Feed.Label
        image={`/images/profile-picture/100x100/${sender[0].profilePicture}`}
      />
      <Feed.Content>
        <Feed.Summary>
          <Feed.User as={Link} to={"/" + sender[0].username}>
            {sender[0].username}
          </Feed.User>{" "}
          <span style={{ fontWeight: "normal" }}>replied</span> {reply[0].text}{" "}
          <span style={{ fontWeight: "normal" }}>to</span> {comment[0].text}
          <span style={{ fontWeight: "normal" }}> on </span>
          <Link to={`/p/${post[0]._id}`}>post</Link>
          <Feed.Date>{dayjs(createdAt).fromNow()}</Feed.Date>
        </Feed.Summary>
        <Feed.Extra images>
          <Link to={`/p/${post[0]._id}`}>
            <Image
              rounded
              src={`/images/post-images/thumbnail/${post[0].photo}`}
            />
          </Link>
        </Feed.Extra>
      </Feed.Content>
    </Feed.Event>
  );
}

function meetingNotification({ _id, createdAt, sender, link }) {
  return (
    <Feed.Event
      onClick={() => {
        navigateToLink(link);
      }}
      key={_id}
    >
      <Feed.Label
        image={`/images/profile-picture/100x100/${sender[0].profilePicture}`}
      />
      <Feed.Content>
        <Feed.Summary>
          <Feed.User as={Link} to={"/" + sender[0].username}>
            {sender[0].username}
          </Feed.User>{" "}
          <span style={{ fontWeight: "normal" }}>
            create a meeting, please check
          </span>
          <Feed.Date>{dayjs(createdAt).fromNow()}</Feed.Date>
        </Feed.Summary>
      </Feed.Content>
    </Feed.Event>
  );
}

class NotificationsPage extends Component {
  componentDidMount = () => {
    document.title = "Notifications";

    this.handleFetchNotifications();
  };

  handleFetchNotifications = () => {
    const { dispatch, notifications } = this.props;
    const ids = notifications.filter((e) => !e.read).map((e) => e._id);

    if (!notifications.length) {
      dispatch(
        notificationActions.fetchNotifications({ initialFetch: true }, ids)
      );
    } else {
      const lastId = notifications[notifications.length - 1]._id;
      dispatch(
        notificationActions.fetchNotifications(
          { initialFetch: false, lastId },
          ids
        )
      );
    }
  };

  render() {
    const { notifications, allNotificationsCount, dispatch } = this.props;

    const notificationsFeed = notifications.map((notification) => {
      if (notification.type === "like_post") {
        return postLikeNotification(notification);
      } else if (notification.type === "follow") {
        return followNotification(notification);
      } else if (notification.type === "post_comment") {
        return addCommentNotification(notification);
      } else if (notification.type === "comment_reply") {
        return commentReplyNotification(notification);
      } else if (notification.type === "comment_tagged") {
        return commentTaggedNotification(notification);
      } else if (notification.type === "post_tagged") {
        return postTaggedNotification(notification);
      } else if (notification.type === "like_commentReply") {
        return likeCommentReplyNotification(notification);
      } else if (notification.type === "new_meeting") {
        return meetingNotification(notification);
      } else {
        return commentLikeNotification(notification);
      }
    });
    const fetchData = () => {
      const lastId = notifications[notifications.length - 1]._id;
      dispatch(
        notificationActions.fetchNotifications({
          initialFetch: false,
          lastId,
        })
      );
    };

    return (
      <div className="card-border-primary shadow-2xl child-page bg-white overflow-hidden pb-6">
        <p className="text-3xl font-semibold mb-4 px-5 pt-5 noti-header">
          Notifications
        </p>
        <div
          className="w-full rounded-lg bg-transparent px-5 py-5 overflow-auto"
          id="scrollablePage"
        >
          <InfiniteScroll
            dataLength={notificationsFeed.length} //This is important field to render the next data
            next={fetchData}
            scrollableTarget="scrollablePage"
            hasMore={
              allNotificationsCount === notifications.length ? false : true
            }
            className="!overflow-hidden"
            loader={<></>}
            endMessage={
              <Divider horizontal>
                <Header as="h5">Yay! You have seen it all</Header>
              </Divider>
            }
          >
            <Feed>{notificationsFeed}</Feed>
            <div className="w-full pt-4 flex justify-center items-center">
              {allNotificationsCount !== notifications.length && (
                <button
                  className="mx-auto px-5 py-3 bg-[#591bc5] text-white hover:bg-purple-900 transition rounded-3xl"
                  onClick={fetchData}
                >
                  Show more
                </button>
              )}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  notifications: state.notification.notifications,
  allNotificationsCount: state.notification.allNotificationsCount,
});

const connectedNotificationsPage = connect(mapStateToProps)(NotificationsPage);
export { connectedNotificationsPage as default };
