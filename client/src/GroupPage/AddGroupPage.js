import React, { Component } from "react";
import { Button, Dropdown, Form, FormField } from "semantic-ui-react";
import { connect } from "react-redux";
import { groupActions } from "../actions/groupActions";
import SpinnerLoading from "../components/SpinnerLoading";
import toast from "react-hot-toast";
import { userActions } from "../actions/userActions";

class AddGroupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultImage:
        "https://www.facebook.com/images/groups/groups-default-cover-photo-2x.png",
      selectedImage:
        "https://www.facebook.com/images/groups/groups-default-cover-photo-2x.png",
      selectedFile: null,
      groupName: "",
      description: "",
      hashtag: "",
      memberIds: [],
      privacy: "public",
      rules: "",
    };
    this.fileInputRef = React.createRef();
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleImageRemove = this.handleImageRemove.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleMultipleSelection = this.handleMultipleSelection.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    document.title = "Create Community Page | social-network";
    window.addEventListener("scroll", this.handleScroll);
    const { allUsers, dispatch } = this.props;

    if (!allUsers.length) {
      dispatch(userActions.getNewUsers({ initialFetch: true }));
    }
  }

  handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.setState(
          { selectedImage: e.target.result, selectedFile: file },
          () => {
            if (this.fileInputRef.current) {
              this.fileInputRef.current.value = "";
            }
          }
        );
      };
      reader.readAsDataURL(file);
    }
  }

  handleImageRemove() {
    this.setState({
      selectedImage: this.state.defaultImage,
      selectedFile: null,
    });
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleMultipleSelection(event, { value }) {
    this.setState({ memberIds: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { selectedFile, groupName, hashtag, memberIds, description, rules } =
      this.state;
    const { dispatch } = this.props;
    const finalData = {
      name: groupName,
      description: description,
      owner: this.props.user._id,
      hashtag: hashtag,
      rules: rules,
      photo: selectedFile ? selectedFile : null,
      memberIds: memberIds,
    };

    dispatch(groupActions.addGroup(finalData));
  }

  componentDidUpdate(prevProps) {
    const { error, isGroupAdded } = this.props;
    if (error && error !== prevProps.error) {
      toast.error(error);
    } else if (isGroupAdded && !prevProps.isGroupAdded) {
      toast.success("Create community successfully");
    }
  }

  render() {
    const {
      selectedImage,
      defaultImage,
      groupName,
      description,
      hashtag,
      rules,
    } = this.state;
    const { loadingAddGroup, allUsers } = this.props;
    const isDefaultImage = selectedImage === defaultImage;
    const usersOptions = allUsers.map((user) => ({
      key: user._id,
      text: user.username,
      value: user._id,
      image: {
        avatar: true,
        src: `/images/profile-picture/100x100/${user.profilePicture}`,
      },
    }));

    return (
      <div className="bg-white rounded-lg card-border-primary p-4">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-[16px]">
            <i className="fa-solid fa-user-group"></i>
          </span>
          <h1 className="text-[20px]">Create Community</h1>
        </div>
        <div className="my-4 flex items-center gap-4 p-4 bg-gray-200 rounded-lg">
          <img
            className="w-[38px] h-[38px] object-cover rounded-full"
            src={`/images/profile-picture/100x100/${this.props.user.profilePicture}`}
            alt="user_avatar"
          />
          <div>
            <h1 className="text-[16px] font-semibold mb-1">
              {this.props.user.username}
            </h1>
            <span>
              {this.props.user.firstName + " " + this.props.user.lastName}
            </span>
          </div>
        </div>
        <div className="relative group">
          <div className="relative">
            <img
              className="w-full mt-4 rounded-lg h-[360px] object-cover"
              src={selectedImage}
              alt="cover_img_group"
            />
            <div className="flex flex-col gap-2">
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 rounded-lg transition-opacity duration-300"></div>
              <label className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] px-[16px] py-[8px] text-[14px] bg-[#591bc5] text-white rounded-lg cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="flex gap-2 items-center">
                  <i className="fa-solid fa-rotate-left"></i>
                  Change image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={this.handleImageChange}
                  className="hidden"
                  ref={this.fileInputRef}
                />
              </label>
              {!isDefaultImage && (
                <button
                  className="w-[32px] h-[32px] bg-white text-[#591bc5] rounded-full absolute top-4 right-4 text-[14px] hover:bg-red-500 hover:text-white shadow-lg"
                  onClick={this.handleImageRemove}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>

          <div className="my-4">
            <Form
              className="flex items-start gap-8"
              onSubmit={this.handleSubmit}
            >
              <div className="w-1/2">
                <FormField>
                  <label className="!text-[14px]">Name:</label>
                  <input
                    name="groupName"
                    placeholder="Enter name of group"
                    className="outline-none !text-[14px] resize-none input-text-group"
                    value={groupName}
                    onChange={this.handleInputChange}
                  />
                </FormField>

                <FormField>
                  <label className="!text-[14px]">Description:</label>
                  <input
                    name="description"
                    placeholder="Enter description"
                    className="outline-none !text-[14px] resize-none input-text-group"
                    value={description}
                    onChange={this.handleInputChange}
                  />
                </FormField>

                <FormField>
                  <label className="!text-[14px]">Hashtag:</label>
                  <input
                    name="hashtag"
                    placeholder="Enter hashtag"
                    className="outline-none !text-[14px] resize-none input-text-group"
                    value={hashtag}
                    onChange={this.handleInputChange}
                  />
                </FormField>

                <FormField>
                  <label className="!text-[14px]">Invite members: </label>
                  <Dropdown
                    placeholder="Select members to invite"
                    fluid
                    multiple
                    search
                    selection
                    options={usersOptions}
                    onChange={this.handleMultipleSelection}
                  />
                </FormField>
              </div>

              <div className="w-1/2">
                <FormField>
                  <label className="!text-[14px]">Rules:</label>
                  <textarea
                    name="rules"
                    placeholder="Your group, your rules"
                    className="outline-none !text-[14px] resize-none input-text-group"
                    value={rules}
                    onChange={this.handleInputChange}
                  />
                </FormField>

                <div className="flex items-center justify-center">
                  <Button
                    className={`relative w-32 h-12 ${
                      loadingAddGroup ? "" : "!bg-[#591bc5] !text-white"
                    }`}
                    type="submit"
                  >
                    {loadingAddGroup ? (
                      <SpinnerLoading size={36} bgColor="gray" />
                    ) : (
                      "Create"
                    )}
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  loadingAddGroup: state.groups.loadingAddGroup,
  error: state.groups.error,
  user: state.user.data,
  loadingUser: state.user.loadingUser,
  groups: state.groups.groups,
  isGroupAdded: state.groups.isGroupAdded,
  allUsers: state.newUsers.users,
  fetchingUsers: state.newUsers.fetching,
  fetchingNewUsers: state.newUsers.fetchingNewUsers,
});

const connectedAddGroupPage = connect(mapStateToProps)(AddGroupPage);
export { connectedAddGroupPage as default };
