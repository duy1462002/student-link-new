export const groupService = {
  logout,
  addGroup,
  getGroup,
  getGroupDetail,
  addMember,
  addAdmin,
  removeAdmin,
  deleteMember,
  getGroupMembers,
  getGroupPosts,
  addGroupPost,
  getPosts,
  updateGroup,
  changeCover,
};

function addGroup(groupData) {
  const formData = new FormData();
  formData.append("hashtag", groupData.hashtag);
  formData.append("name", groupData.name);
  formData.append("photo", groupData.photo);
  formData.append("owner", groupData.owner);
  groupData.memberIds.forEach((item) => formData.append("memberIds[]", item))
  formData.append("description", groupData.description);  
  formData.append("rules", groupData.rules);
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
    },
    body: formData

  };

  return fetch("/api/group/addGroup", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}

function getGroup(params) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token,
    },
    body: JSON.stringify({
      ...params,
    }),
  };

  return fetch("/api/user/getgroups", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}

function getGroupDetail(params) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token,
    },
    body: JSON.stringify({
      ...params,
    }),
  };

  return fetch("/api/group/groupDetail", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}

function getGroupPosts(params) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token,
    },
    body: JSON.stringify({
      ...params,
    }),
  };

  return fetch("/api/group/getposts", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res.data;
    });
}

function addGroupPost(groupData) {
  const formData = new FormData();
  formData.append("description", groupData.description);  
  formData.append("groupId", groupData.groupId);
  formData.append("hashtags", "#g-community");
  formData.append("photo", groupData.photo);
  formData.append("coordinates", groupData.coordinates);
  formData.append("locationName", groupData.locationName);
  formData.append("tags", JSON.stringify(groupData.tags));
  formData.append("document", groupData.document);
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
    },
    body: formData

  };

  return fetch("/api/group/addpost", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}

function addMember(params) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token,
    },
    body: JSON.stringify({
      ...params,
    }),
  };

  return fetch("/api/group/addMember", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}

function addAdmin(params) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token,
    },
    body: JSON.stringify({
      ...params,
    }),
  };

  return fetch("/api/group/addAdmin", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}

function removeAdmin(params) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token,
    },
    body: JSON.stringify({
      ...params,
    }),
  };

  return fetch("/api/group/removeAdmin", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}

function deleteMember(params) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token,
    },
    body: JSON.stringify({
      ...params,
    }),
  };

  return fetch("/api/group/deleteMember", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}

function getGroupMembers(params) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token,
    },
    body: JSON.stringify({
      ...params,
    }),
  };

  return fetch("/api/group/getgroupMembers", requestOptions)
    .then(handleResponse)
    .then((res) => {
      // console.log(res);
      return res;
    });
}

function getPosts(params) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token,
    },
    body: JSON.stringify({
      ...params,
    }),
  };

  return fetch("/api/group/getposts", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}


function updateGroup(params) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: JSON.parse(localStorage.getItem("user")).token,
    },
    body: JSON.stringify({
      ...params,
    }),
  };

  return fetch("/api/group/updategroup", requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    });
}


function changeCover(params) {
  console.log(params);
  const formData = new FormData();
  formData.append("groupId", params.groupId);
  formData.append("photo", params.photo);  

  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: JSON.parse(localStorage.getItem("user")).token,
    },
    body: formData,
  };

  return fetch("/api/group/changecover", requestOptions)
    .then(handleResponse)
    .then((res) => {
      console.log(res);
      return res;
    });
}

function logout() {
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
