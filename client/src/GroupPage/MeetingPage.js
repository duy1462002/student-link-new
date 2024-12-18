import React, { Component } from "react";
import { connect } from "react-redux";
import SpinnerLoading from "../components/SpinnerLoading";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
} from "semantic-ui-react";
import toast from "react-hot-toast";
import { zoomAction } from "../actions/zoomActions";
import { zoomService } from "../_services/zoomService";

class MeetingPage extends Component {
  state = {
    meetingName: "",
    meetingDate: "",
    meetingContent: "",
    openModal: false,
    isCreatingMeeting: false,
    isDeletingMeeting: false,
    isJoiningMeeting: false,
  };

  componentDidMount = () => {
    this.handleGetMeetings();
  };

  handleGetMeetings = () => {
    const { dispatch, currentGroup } = this.props;
    dispatch(zoomAction.getMeetings(currentGroup._id));
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleCreateMeeting = async () => {
    const { meetingName, meetingDate, meetingContent } = this.state;
    const { currentGroup } = this.props;
    this.setState({ isCreatingMeeting: true });
    if (!meetingName || !meetingDate || !meetingContent) {
      toast.error("Please provide both name and date for the meeting.");
      return;
    }

    let response;

    const formattedDate = meetingDate + ":00";

    let data = {
      topic: meetingName,
      type: 2,
      duration: 30,
      timezone: "Asia/Saigon",
      start_time: formattedDate,
      agenda: meetingContent,
      groupId: currentGroup._id,
    };

    await zoomService.scheduleMeeting(data).then((res) => {
      response = res;
      if (response) {
        toast.success("Create meeting successfully!");
      }
    });
    this.setState({ isCreatingMeeting: false, openModal: false });
    this.handleGetMeetings();
  };

  handleGetMeetingLink = async (meetingId) => {
    this.setState({ isJoiningMeeting: true });
    let response;
    await zoomService
      .getMeetingLink(meetingId)
      .then((res) => {
        response = res;
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });

    if (response && response.join_url) {
      window.open(response.join_url, "_blank");
    } else {
      toast.error("There was a problem when getting the link");
    }
    this.setState({ isJoiningMeeting: false });
    this.handleGetMeetings();
  };

  handleCopyPassword = (password) => {
    if (!password) {
      toast.error("No password available to copy.");
      return;
    }

    navigator.clipboard
      .writeText(password)
      .then(() => {
        toast.success("Password copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy password: ", err);
        toast.error("Failed to copy password.");
      });
  };

  handleDeleteMeeting = async (meetingId) => {
    this.setState({ isDeletingMeeting: true });
    let response;

    await zoomService
      .deleteMeeting(meetingId)
      .then((res) => {
        response = res;
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });

    toast.success("Delete meeting successfully!");
    this.setState({ isDeletingMeeting: false });
    this.handleGetMeetings();
  };

  handleOpenSchedule = () => {
    this.setState({ openModal: true });
  };

  render() {
    const { meetings, isLoading, currentGroupAdmins, user } = this.props;
    const { meetingName, meetingDate, meetingContent } = this.state;

    const currentGroupAdminsArray = currentGroupAdmins.map(
      (item) => item.userId
    );

    const isHavePermission = currentGroupAdminsArray.includes(user._id);

    if (isLoading) {
      return (
        <div className="bg-white rounded-lg mt-[14px] p-4 w-2/3 relative min-h-[500px]">
          <SpinnerLoading size={80} bgColor="white" />
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg mt-[14px] p-4 w-2/3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Meetings</h1>
          {isHavePermission ? (
            <Modal
              closeIcon={false}
              size="small"
              open={this.state.openModal}
              centered
              className="max-h-[80vh]"
              trigger={
                <Button
                  className="!bg-[#591bc5] !text-white hover:opacity-80"
                  onClick={this.handleOpenSchedule}
                >
                  Create Meeting
                </Button>
              }
            >
              <ModalHeader className="!flex !justify-between !items-center !text-[20px] !bg-[#591bc5] !text-white !sticky !top-0 !z-20">
                <h1 className="flex-grow text-center">Create Meeting</h1>
                <span
                  onClick={() => {
                    this.setState({ openModal: false });
                  }}
                  className="cursor-pointer"
                >
                  <i className="fa-solid fa-xmark"></i>
                </span>
              </ModalHeader>
              <ModalContent>
                <div className="py-4">
                  <Input
                    name="meetingName"
                    placeholder="Meeting Name"
                    value={meetingName}
                    onChange={this.handleInputChange}
                    className="!mr-4"
                  />
                  <Input
                    name="meetingContent"
                    placeholder="Meeting description"
                    value={meetingContent}
                    onChange={this.handleInputChange}
                    className="!mr-4"
                  />
                  <Input
                    type="datetime-local"
                    name="meetingDate"
                    value={meetingDate}
                    onChange={this.handleInputChange}
                    className="!mr-4"
                  />
                  <Button
                    className="!bg-[#591bc5] !text-white hover:opacity-80 relative w-40 h-10 text-nowrap"
                    onClick={this.handleCreateMeeting}
                  >
                    {this.state.isCreatingMeeting ? (
                      <SpinnerLoading size={36} bgColor="gray" />
                    ) : (
                      "Create Meeting"
                    )}
                  </Button>
                </div>
              </ModalContent>
            </Modal>
          ) : (
            <></>
          )}
        </div>

        {meetings.length ? (
          <div className="mt-6">
            {meetings.map((meeting) => (
              <div
                key={meeting._id}
                className="flex justify-between items-center py-4 border-t border-[#591bc5]"
              >
                <div>
                  <h2 className="text-lg font-semibold">{meeting.topic}</h2>
                  <p className="text-sm">Description: {meeting.agenda}</p>
                  <p className="text-sm">
                    Date:{" "}
                    {new Date(meeting.start_time).toLocaleString(undefined, {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="!bg-[#591bc5] !text-white hover:opacity-80 relative"
                    onClick={() => this.handleGetMeetingLink(meeting.meetingId)}
                  >
                    {this.state.isJoiningMeeting ? (
                      <SpinnerLoading size={36} bgColor="gray" />
                    ) : (
                      "Join"
                    )}
                  </Button>

                  {isHavePermission ? (
                    <>
                      <Button
                        className="!bg-[#27ae60] !text-white hover:opacity-80 relative"
                        onClick={() =>
                          this.handleCopyPassword(meeting.password)
                        }
                      >
                        Copy Password
                      </Button>

                      <Button
                        className="!bg-[#e74c3c] !text-white hover:opacity-80 relative"
                        onClick={() =>
                          this.handleDeleteMeeting(meeting.meetingId)
                        }
                      >
                        {this.state.isDeletingMeeting ? (
                          <SpinnerLoading size={36} bgColor="gray" />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6">There's no meetings right now</div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  meetings: state.zoom.meetings,
  isLoading: state.zoom.isLoading,
  currentGroup: state.groups.currentGroup,
  groupOwner: state.groups.groupOwner,
  currentGroupAdmins: state.groups.currentGroupAdmins,
  user: state.user.data,
});

export default connect(mapStateToProps)(MeetingPage);
