import React from "react";
import { Popup } from "semantic-ui-react";
import Linkify from "linkifyjs/react";
import * as linkify from "linkifyjs";
import hashtag from "linkifyjs/plugins/hashtag";
import mention from "linkifyjs/plugins/mention";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

hashtag(linkify);
mention(linkify);

const linkifyOptions = {
  formatHref: function (href, type) {
    if (type === "hashtag") {
      href = "/hashtags/" + href.substring(1);
    }
    if (type === "mention") {
      href = "/" + href.substring(1);
    }
    return href;
  },
  attributes: {
    target: {
      url: "_blank",
    },
  },
};

function ShowImage({ show, image }) {
  return show ? (
    <img src={`/images/profile-picture/100x100/${image}`} alt="" />
  ) : (
    <div></div>
  );
}

function Document({ document }) {
  return <div
    className="w-full bg-white"
    style={{
      borderBottom: "1px solid #ccc",
    }}
  >
    <div className="p-3">
      <a
        href={require(`../../../public/documents/chat-documents/${document}`)}
        download={document}
        className="inline-flex items-center gap-3 px-4 py-2 bg-[#591bc5] text-white font-semibold rounded-lg shadow-md hover:opacity-90 hover-text-white"
      >
        <i className="fa-solid fa-file-arrow-down"></i>
        Download {document}
      </a>
    </div>
  </div>
}

const MessengerMessages = ({
  message,
  userId,
  profilePicture,
  currentRoom,
}) => {
  console.log(message);
  
  if (message.sender === userId) {
    if (message.sent === false) {
      return (
        <li className="replies" key={message.uuid}>
          <ShowImage image={profilePicture} show={message.picture}></ShowImage>
          <p
            style={{
              backgroundColor: "#f5f5f5",
              color: "black",
              border: "1px solid grey",
              wordWrap: "break-word",
            }}
          >
            <Linkify options={linkifyOptions}>{message.value}</Linkify>
          </p>
        </li>
      );
    }
    if (message.messageType === "text") {
      return (
        <li className="replies">
          <ShowImage image={profilePicture} show={message.picture}></ShowImage>
          <Popup
            content={
              dayjs(message.createdAt).fromNow() + ", seen:" + message.read
            }
            trigger={
              <p>
                <Linkify options={linkifyOptions}>{message.text}</Linkify>
              </p>
            }
          />
        </li>
      );
    } else if (message.messageType === "document") {
      return (
        <li className="replies">
          <ShowImage
            image={profilePicture}
            show={message.picture}
          ></ShowImage>
          <Popup
            content={
              dayjs(message.createdAt).fromNow() + ", seen:" + message.read
            }
            trigger={
              <Document document={message.file}/>
            }
          />
        </li>
      )
    } else {
      return (
        <li className="replies">
          <ShowImage image={profilePicture} show={message.picture}></ShowImage>
          <Popup
            content={
              dayjs(message.createdAt).fromNow() + ", seen:" + message.read
            }
            trigger={
              <img
                style={{
                  borderRadius: "3%",
                  objectFit: "cover",
                  width: "40%",
                  height: "20%",
                }}
                src={`/images/chat-images/${message.photo}`}
                alt=""
              />
            }
          />
        </li>
      );
    }
  } else {
    if (message.sent === false) {
      return (
        <li className="sent" key={message.uuid}>
          <ShowImage
            image={currentRoom.user.profilePicture}
            show={message.picture}
          ></ShowImage>
          <p
            style={{
              backgroundColor: "#f5f5f5",
              color: "black",
              border: "1px solid grey",
              wordWrap: "break-word",
            }}
          >
            <Linkify options={linkifyOptions}>{message.value}</Linkify>
          </p>
        </li>
      );
    }
    if (message.messageType === "text") {
      return (
        <li className="sent">
          <ShowImage
            image={currentRoom.user.profilePicture}
            show={message.picture}
          ></ShowImage>

          <Popup
            content={
              dayjs(message.createdAt).fromNow() + ", seen:" + message.read
            }
            trigger={
              <p>
                {" "}
                <Linkify options={linkifyOptions}>{message.text}</Linkify>
              </p>
            }
          />
        </li>
      );
    } else if (message.messageType === "document") {
      return (
        <li className="sent">
          <ShowImage
            image={currentRoom.user.profilePicture}
            show={message.picture}
          ></ShowImage>
          <Popup
            content={
              dayjs(message.createdAt).fromNow() + ", seen:" + message.read
            }
            trigger={
              <Document document={message.file}/>
            }
          />
        </li>
      )
    } else {
      return (
        <li className="sent">
          <ShowImage
            image={currentRoom.user.profilePicture}
            show={message.picture}
          ></ShowImage>
          <Popup
            content={
              dayjs(message.createdAt).fromNow() + ", seen:" + message.read
            }
            trigger={
              <img
                style={{
                  borderRadius: "3%",
                  objectFit: "cover",
                  width: "40%",
                  height: "20%",
                }}
                src={`/images/chat-images/${message.photo}`}
                alt=""
              />
            }
          />
        </li>
      );
    }
  }
};

export default MessengerMessages;
