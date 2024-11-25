export const roleService = {
    logout,
    addRole,
    getRolesOfUser,
    addMember,
    removeMember,
    getRoles
  };
  
  function addRole(params) {
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: JSON.parse(localStorage.getItem("user")).token,
      },
      body: JSON.stringify({
        ...params,
      })
  
    };
  
    return fetch("/api/role/addRole", requestOptions)
      .then(handleResponse)
      .then((res) => {
        return res;
      });
  }
  
  function getRolesOfUser(params) {
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
  
    return fetch("/api/role/getRolesOfUser", requestOptions)
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
  
    return fetch("/api/role/addMember", requestOptions)
      .then(handleResponse)
      .then((res) => {
        return res;
      });
  }
  
  function removeMember(params) {
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
  
    return fetch("/api/role/removeMember", requestOptions)
      .then(handleResponse)
      .then((res) => {
        return res;
      });
  }
  
  function getRoles(params){
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
  
    return fetch("/api/role/getRoles", requestOptions)
      .then(handleResponse)
      .then((res) => {
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
  