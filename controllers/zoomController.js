const { default: axios } = require("axios");
const Meeting = require('../models/Meetings')

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
  console.log('res', response.data.access_token);
  return response.data.access_token;
}

// Hàm lên lịch họp
exports.scheduleMeeting = async (req, res) => {
    try {
      // Kiểm tra dữ liệu đầu vào
      const { topic, type, duration, start_time, agenda, groupId } = req.body;
      if (!topic || !type || !start_time || !duration || !groupId) {
        return res.status(400).json({ error: "Missing required fields: topic, type, start_time, duration, groupId" });
      }
  
      const token = await getAccessToken();
  
      const meetingData = {
        topic,
        type: type || 2, // Mặc định type = 2 (scheduled meeting)
        duration: duration || 30,
        start_time,
        agenda: agenda || '',
      };
  
      // Tạo cuộc họp trên Zoom
      const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', meetingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Lưu thông tin cuộc họp vào cơ sở dữ liệu
      const newMeeting = new Meeting({
        meetingId: response.data.id,
        topic: response.data.topic,
        start_time: response.data.start_time,
        duration: response.data.duration,
        agenda: response.data.agenda,
        groupId, // Lưu lại groupId để liên kết với nhóm
      });

      // Lưu vào database
      await newMeeting.save();

      res.status(201).json(response.data);
    } catch (error) {
      console.error('Error scheduling meeting:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json(error.response?.data || { message: error.message });
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

        if (meetings.length === 0) {
            return res.status(404).json({ message: 'No meetings found for this group' });
        }

        res.status(200).json(meetings);
    } catch (error) {
        console.error('Error fetching meetings:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};