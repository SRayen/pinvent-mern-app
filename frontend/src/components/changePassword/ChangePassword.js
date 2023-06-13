import React, { useState } from "react";
import "./ChangePassword.scss";
import { toast } from "react-toastify";
import { changePassword } from "../../services/authService";
import Card from "../card/Card";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const ChangePassword = () => {
  const navigate = useNavigate();
  const initialState = {
    oldPassword: "",
    password: "",
    password2: "",
  };

  const [formData, setFormData] = useState(initialState);
  const { oldPassword, password, password2 } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const changePass = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      return toast.error("New passwords do not match");
    }
    const formData = {
      oldPassword,
      password,
    };
    const data = await changePassword(formData);
    toast.success(data);
    navigate("/profile");
  };

  const [showOldPassword, setShowOldPassword] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (show) => {
    setShowPassword(!show);
  };

  return (
    <div className="change-password">
      <Card cardClass={"password-card"}>
        <h3>Change Password</h3>
        <form onSubmit={changePass} className="--form-control">
          <div className="--flex-start">
            <input
              type={showOldPassword ? "text" : "password"}
              placeholder="Old Password"
              required
              name="oldPassword"
              value={oldPassword}
              onChange={handleInputChange}
            />
            <div className="--flex-center">
              <FaEye
                className="--mt --ml"
                color="gray"
                size={19}
                id="showOldPassword"
                checked={showOldPassword}
                onClick={() => setShowOldPassword(!showOldPassword)}
              />
            </div>
          </div>

          <div className="--flex-start">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              required
              name="password"
              value={password}
              onChange={handleInputChange}
            />
            <div className="--flex-center">
              <FaEye
                className="--mt --ml"
                color="gray"
                size={19}
                id="showPassword"
                checked={showPassword}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          <div className="--flex-start">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              required
              name="password2"
              value={password2}
              onChange={handleInputChange}
            />
            <div className="--flex-center">
              <FaEye
                className="--mt --ml"
                color="gray"
                size={19}
                id="showConfirmPassword"
                checked={showConfirmPassword}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
          </div>

          <button type="submit" className="--btn --btn-primary">
            Change Password
          </button>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
