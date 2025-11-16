// <<<<<<< HEAD
import axios from "axios";

const API_URL = "https://college-ft7v.onrender.com";

export const adminLog = async (data) => {
  return await axios.post(`${API_URL}/api/login/`, data);
};

export const otp_verify = async (data) => {
  return await axios.post(`${API_URL}/api/verify_otp/`, data);
};

export const resend_otp = async (data) => {
  return await axios.post(`${API_URL}/api/resend-otp/`, data);
};

export const sendResetCode = (email) => {
  return axios.post(`${API_URL}/api/send-reset-code/`, { email });
};

export const verifyCodeAndResetPassword = (
  cleanedEmail,
  verificationCode,
  newPassword
) => {
  return axios.post(`${API_URL}/api/reset-password/`, {
    cleanedEmail,
    verificationCode,
    newPassword,
  });
};


