import axios from "axios";
import { toast } from "react-toastify";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const validateEmail = (email) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
};
//REGISTER USER
export const registerUser = async (userData) => {
  try {
    /* withCredentials:true :==> to allow this request to get credentials from that API Endpoint.
 remember: (when we register a user==>getting back a cookie from backend url) ==>it will be saved in the 
 frontend to know this user is loggedIn */
    //Here we can delete { withCredentials: true } because it is by default in App.js
    const response = await axios.post(
      `${BACKEND_URL}/api/users/register`,
      userData,
      { withCredentials: true }
    );

    // if (response.statusText === "ok") {
    if (response.status == 201) {
      toast.success("User Registered successfully");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//LOGIN USER
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/users/login`,
      userData
    );

    // if (response.statusText === "ok") {
    if (response.status == 201) {
      toast.success("Login Successful...");
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//LOGOUT USER
export const logoutUser = async () => {
  try {
    await axios.get(`${BACKEND_URL}/api/users/logout`);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//FORGOT PASSWORD
export const forgotPassword = async (userData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/users/forgotpassword`,
      userData
    );
    toast.success(response.data.message);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//RESET PASSWORD
export const resetPassword = async (userData, resetToken) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/api/users/resetpassword/${resetToken}`,
      userData
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

//GET LOGIN STATUS
export const getLoginStatus = async () => {
  
  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/loggedin`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
      toast.error(message);
  }
};

//GET USER PROFILE 
export const getUser = async () => {
  
  try {
    const response = await axios.get(`${BACKEND_URL}/api/users/getuser`);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
      toast.error(message);
  }
}

  //UPDATE PROFILE 
export const updateUser = async (formData) => {
  
  try {
    const response = await axios.patch(`${BACKEND_URL}/api/users/updateuser`,formData);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
      toast.error(message);
  }
};

  //CHANGE PASSWORD
  export const changePassword = async (formData) => {
  
    try {
      const response = await axios.patch(`${BACKEND_URL}/api/users/changepassword`,formData);
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
        toast.error(message);
    }
  };