export const zoomService = {
  logout,
  scheduleMeeting,
  getMeetingLink,
  getMeetings,
  deleteMeeting
};

function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("user");
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        window.location.reload(true);
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}

function scheduleMeeting(data) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  return fetch("/api/zoom/schedule", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}

function getMeetingLink(meetingId) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ meetingId }),
  };
  return fetch("/api/zoom/link", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}

function getMeetings(groupId) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ groupId }),
  };
  return fetch("/api/zoom/meetings", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}

function deleteMeeting(meetingId) {
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ meetingId }),
  };
  return fetch("/api/zoom/delete-meeting", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}
