import React, { Component } from "react";
import { Button, Message, Modal, Form } from "semantic-ui-react";
import { connect } from "react-redux";
import { userActions } from "../actions/userActions";
import ProfilePictureForm from "./ProfilePictureForm";
import toast from "react-hot-toast";

export class ImageCropModal extends Component {
  state = { open: false };

  open = () => this.setState({ open: true });
  close = () => this.setState({ open: false });

  render() {
    const { open } = this.state;

    return (
      <Modal
        open={open}
        onOpen={this.open}
        onClose={this.close}
        size="mini"
        className=""
        trigger={
          <button className="w-full h-full  bg-transparent flex flex-col items-center text-lg justify-center hover:bg-black opacity-60  text-transparent hover:text-white  rounded-b-full transition-all duration-300 ease-in-out">
            <i className="fa-solid fa-camera"></i>
            <span>Change avatar</span>
          </button>
        }
      >
        <Modal.Header className="text-center !text-2xl">
          Change Profile Photo
        </Modal.Header>
        <Modal.Content className="!p-0">
          <ul>
            <li>
              <ProfilePictureForm />
            </li>
            <li
              className="profile-avatar-btn text-red-500"
              onClick={() => {
                this.close();
              }}
            >
              Remove Curren Photo
            </li>
            <li
              className="profile-avatar-btn"
              onClick={() => {
                this.close();
              }}
            >
              Cancel
            </li>
          </ul>
        </Modal.Content>
      </Modal>
    );
  }
}

class EditProfileModal extends Component {
  state = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    bio: "",
    profilePicture: "",
    isDisabled: true,
  };
  state = { open: false };

  open = () => this.setState({ open: true });
  close = () => this.setState({ open: false });

  componentDidMount = () => {
    const { firstName, lastName, username, email, bio, profilePicture } =
      this.props;
    this.setState({
      firstName,
      lastName,
      username,
      email,
      bio,
      profilePicture,
      isDisabled: true,
    });
  };

  handleChange = (e, { name, value }) => {
    this.setState({ isDisabled: false, [name]: value });
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    const { profilePicture, open, ...data } = this.state;
    dispatch(userActions.updateUserData(data));
    this.setState({ isDisabled: true });
    this.close();
    toast.success("Profile updated successfully");
  };

  render() {
    const { firstName, lastName, username, email, bio, profilePicture } =
      this.state;
    const { updaingUser, hasError } = this.props;
    const { open } = this.state;

    return (
      <Modal
        open={open}
        onOpen={this.open}
        onClose={this.close}
        trigger={this.props.children}
        style={{ color: "reda" }}
        size="tiny"
      >
        <Modal.Header className="text-center !text-2xl items-center !flex justify-between">
          <h1>Edit profile</h1>
          <span
            className="cursor-pointer"
            onClick={() => {
              this.close();
            }}
          >
            <i className="fa-solid fa-xmark"></i>
          </span>
        </Modal.Header>
        <Modal.Content>
          <Modal.Description>
            {hasError ? (
              <Message negative>
                <p>{hasError}</p>
              </Message>
            ) : null}
            <Form
              size="huge"
              name="form"
              onSubmit={this.handleSubmit}
              loading={updaingUser ? true : false}
            >
              <div className="p-6 bg-gray-200 flex  items-center relative rounded-lg mb-4 justify-center">
                <div className="flex flex-col items-center gap-y-4">
                  <img
                    alt="avatar"
                    className="w-[60px] rounded-full"
                    src={`/images/profile-picture/100x100/${profilePicture}`}
                  />
                  <span className="font-semibold">{username}</span>
                </div>
              </div>
              <Form.Group className="!flex-col gap-y-4">
                <Form.Input
                  fluid
                  className=""
                  label="First Name"
                  placeholder="First Name"
                  type="text"
                  name="firstName"
                  onChange={this.handleChange}
                  value={firstName}
                />

                <Form.Input
                  fluid
                  label="Last Name"
                  placeholder="Last Name"
                  type="text"
                  name="lastName"
                  onChange={this.handleChange}
                  value={lastName}
                />
              </Form.Group>
              <Form.Group className="!flex-col gap-y-4">
                <Form.Input
                  fluid
                  label="Username"
                  placeholder="Username"
                  type="text"
                  name="username"
                  onChange={this.handleChange}
                  value={username}
                />
                <Form.Input
                  fluid
                  label="Email"
                  placeholder="Email"
                  type="text"
                  name="email"
                  onChange={this.handleChange}
                  value={email}
                />
              </Form.Group>
              <Form.TextArea
                style={{ minHeight: 100, maxHeight: 100 }}
                label="Bio"
                placeholder="Tell us more about you..."
                type="text"
                name="bio"
                onChange={this.handleChange}
                value={bio}
              />
              <Button
                size="big"
                content="Update information"
                disabled={this.state.isDisabled}
                primary
                fluid
              />
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const { updaingUser, hasError } = state.user;
  const { firstName, lastName, username, email, bio, profilePicture } =
    state.user.data;
  return {
    updaingUser,
    hasError,
    firstName,
    lastName,
    username,
    email,
    bio,
    profilePicture,
  };
}

const connectedEditProfileModal = connect(mapStateToProps)(EditProfileModal);
export { connectedEditProfileModal as EditProfileModal };
