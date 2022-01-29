import API from "../config/api";

const signin = async (email, password) => {
  return await API.post("/api/auth/signin", {
    email: email,
    password: password,
  }).then(res => {
    if (res.data.accessToken) {
      localStorage.setItem("awesomeLeadsToken", JSON.stringify(res.data));
    }
    return res.data;
  })
}

const logout = () => {
  localStorage.removeItem("awesomeLeadsToken");
  window.location.reload = false;
}

const register = (username, email, password) => {
  return API.post("/api/auth/signup", {
    username,
    email,
    password
  });
}

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('awesomeLeadsToken'));
}

export {
  signin,
  logout,
  register, 
  getCurrentUser
}