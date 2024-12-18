const { default: axios } = require("axios");
const mongoose = require("mongoose");
const Meeting = require('../models/Meetings');
const Group = mongoose.model("Group");
const User = mongoose.model("User");
const Notification = mongoose.model("Notification");
const notificationHandler = require("../handlers/notificationHandler");

async function getAccessToken() {
  const response = await axios.post("https://zoom.us/oauth/token", null, {
    params: {
      grant_type: "account_credentials",
      account_id: process.env.ZOOM_ACCOUNT_ID
    },
    auth: {
      username: process.env.ZOOM_CLIENT_ID,
      password: process.env.ZOOM_CLIENT_SECRET,
    },
  });
  return response.data.access_token;
}

const deleteMeetingFromZoom = async (meetingId) => {
  try {
    const token = await getAccessToken();

    const zoomResponse = await axios.delete(
      `https://api.zoom.us/v2/meetings/${meetingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (zoomResponse.status === 204) {
      console.log("Meeting deleted from Zoom successfully");
      return { success: true };
    }

    return { success: false, message: "Failed to delete meeting from Zoom" };
  } catch (error) {
    console.error(
      "Error deleting meeting from Zoom:",
      error.response?.data || error.message
    );

    return {
      success: false,
      message: error.response?.data || "Failed to delete meeting on Zoom",
    };
  }
};

// Hàm lên lịch họp
exports.scheduleMeeting = async (req, res) => {
  try {
    const { topic, type, duration, start_time, agenda, groupId } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!topic || !type || !start_time || !duration || !groupId) {
      return res.status(400).json({
        error: "Missing required fields: topic, type, start_time, duration, groupId",
      });
    }

    // Kiểm tra groupId tồn tại trong database (nếu cần)
    const groupExists = await Group.findById(groupId);
    if (!groupExists) {
      return res.status(404).json({ error: "Group not found" });
    }

    const token = await getAccessToken();

    const meetingData = {
      topic,
      type: type || 2,
      duration: duration || 30,
      start_time: new Date(start_time).toISOString(), // Chuyển sang UTC
      agenda: agenda || '',
    };

    // Tạo cuộc họp trên Zoom
    const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', meetingData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const newMeeting = new Meeting({
      meetingId: response.data.id,
      topic: response.data.topic,
      start_time: response.data.start_time,
      duration: response.data.duration,
      agenda: response.data.agenda,
      password: response.data.password,
      groupId,
    });

    await newMeeting.save();

    const notification = new Notification({
      sender: req.userData.userId,
      receiver: groupExists.members.map(member => member.user),
      type: "new_meeting",
      groupId: groupId,
      link: `/group/${groupId}/meetings`,
      meetingId: newMeeting._id,
    });

    await notification.save();

    notificationHandler.sendNewMeetingNotification({
      req,
      groupMembers: groupExists.members,
      user: req.userData,
      notification,
    });

    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error scheduling meeting:', error.response?.data || error.message);

    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};


  

// Hàm lấy link họp
exports.getMeetingLink = async (req, res) => {
  try {
    const token = await getAccessToken();
    const meetingId = req.body.meetingId;

    if (!meetingId) {
      return res.status(400).json({ message: 'Meeting ID is required' });
    }

    const response = await axios.get(
      `https://api.zoom.us/v2/meetings/${meetingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response);
    

    res.json({ join_url: response.data.join_url });
} catch (error) {
    console.error('Error get meeting link:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { message: error.message });
  }
}; 

exports.getMeetingsByGroup = async (req, res) => {
    try {
        const { groupId } = req.body;
        
        if (!groupId) {
            return res.status(400).json({ error: 'GroupId is required' });
        }

        const meetings = await Meeting.find({ groupId }).exec();

        res.status(200).json(meetings);
    } catch (error) {
        console.error('Error fetching meetings:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const { meetingId } = req.body;

    if (!meetingId) {
      return res.status(400).json({ error: "MeetingId is required" });
    }

    const zoomResult = await deleteMeetingFromZoom(meetingId);

    if (!zoomResult.success) {
      return res.status(500).json({
        error: zoomResult.message,
        message: "Failed to delete meeting from Zoom",
      });
    }

    const deletedMeeting = await Meeting.findOneAndDelete({ meetingId }).exec();

    if (!deletedMeeting) {
      return res
        .status(404)
        .json({ message: "Meeting not found in database" });
    }

    return res.status(200).json({
      message: "Meeting deleted successfully from Zoom and database",
      deletedMeeting,
    });
  } catch (error) {
    console.error("Error deleting meeting:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};