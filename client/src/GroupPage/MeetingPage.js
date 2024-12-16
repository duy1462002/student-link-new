import React, { Component } from "react";
import { connect } from "react-redux";
import SpinnerLoading from "../components/SpinnerLoading";
import { Button, Input, Modal, ModalContent, ModalHeader } from "semantic-ui-react";
import toast from "react-hot-toast";
import { zoomAction } from "../actions/zoomActions";
import { zoomService } from "../_services/zoomService";

class MeetingPage extends Component {
  state = {
    meetingName: "",
    meetingDate: "",
    openModal: false,
  };

  componentDidMount = () => {
    const { dispatch, currentGroup } = this.props;
    dispatch(zoomAction.getMeetings(currentGroup._id));
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleCreateMeeting = () => {
    const { meetingName, meetingDate } = this.state;
    const { currentGroup } = this.props;

    if (!meetingName || !meetingDate) {
      toast.error("Please provide both name and date for the meeting.");
      return;
    }

    let response;
    let data = {
      topic: meetingName,
      type: 2,
      duration: 30,
      start_time: meetingDate,
      agenda: "Meeting Agenda",
      groupId: "674533f4d0e1804f0800b543",
    };

    zoomService.scheduleMeeting(data);
  };

  handleDeleteMeeting = () => {
    
  }

  handleOpenSchedule = () => {
    this.setState({ openModal: true });
  };

  render() {
    const { meetings, isLoading } = this.props;
    const { meetingName, meetingDate } = this.state;

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
                      type="date"
                      name="meetingDate"
                      value={meetingDate}
                      onChange={this.handleInputChange}
                      className="!mr-4"
                    />
                    <Button
                      className="!bg-[#591bc5] !text-white hover:opacity-80"
                      onClick={this.handleCreateMeeting}
                    >
                      Create Meeting
                    </Button>
                  </div>
              </ModalContent>
            </Modal>
        </div>

        <div className="mt-6">
          {meetings.map((meeting) => (
            <div
              key={meeting._id}
              className="flex justify-between items-center py-4 border-t border-[#591bc5]"
            >
              <div>
                <h2 className="text-lg font-semibold">{meeting.agenda}</h2>
                <p className="text-sm">
                  Date: {new Date(meeting.start_time).toLocaleDateString()}
                </p>
              </div>
              <Button
                className="!bg-[#e74c3c] !text-white hover:opacity-80"
                onClick={() => this.handleDeleteMeeting(meeting.meetingId)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
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
});

export default connect(mapStateToProps)(MeetingPage);
