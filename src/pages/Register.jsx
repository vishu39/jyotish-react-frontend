import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Typography, DatePicker, TimePicker, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined, EnvironmentOutlined } from "@ant-design/icons";
import api from "../api";
import ThemeSwitcher from "../components/ThemeSwitcher.jsx";

const { Title, Text } = Typography;

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        dateOfBirth: values.dateOfBirth?.toISOString(),
        birthTime: values.birthTime?.format("HH:mm"),
        birthPlace: values.birthPlace,
      };
      const { data } = await api.post("/auth/register", payload);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      message.success("Registration successful!");
      navigate("/dashboard");
    } catch (err) {
      message.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orb orb-1" />
      <div className="auth-bg-orb orb-2" />
      <div className="auth-bg-orb orb-3" />

      <div className="auth-theme-switcher">
        <ThemeSwitcher />
      </div>

      <div className="auth-card auth-card-wide">
        <div className="auth-logo">
          <span className="auth-logo-icon">☸</span>
        </div>
        <Title level={2} className="auth-title">Create Account</Title>
        <Text className="auth-subtitle">Enter your birth details for Kundli</Text>

        <Form name="register" onFinish={onFinish} size="large" className="auth-form">
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input
              prefix={<UserOutlined className="input-icon" />}
              placeholder="Full Name"
              className="auth-input"
            />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="input-icon" />}
              placeholder="Email address"
              className="auth-input"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 6, message: "Minimum 6 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="input-icon" />}
              placeholder="Password"
              className="auth-input"
            />
          </Form.Item>

          <div className="auth-form-row">
            <Form.Item name="dateOfBirth" style={{ flex: 1 }}>
              <DatePicker placeholder="Date of Birth" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="birthTime" style={{ flex: 1 }}>
              <TimePicker placeholder="Birth Time" format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <Form.Item name="birthPlace">
            <Input
              prefix={<EnvironmentOutlined className="input-icon" />}
              placeholder="Birth Place (e.g., Delhi, India)"
              className="auth-input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className="auth-btn"
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <Text className="auth-link-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </Text>

        <div className="auth-footer-dots">
          <span style={{ color: "var(--accent)" }}>✦</span>
          <span style={{ color: "var(--text-muted)", fontSize: 10 }}>✦</span>
          <span style={{ color: "var(--accent)" }}>✦</span>
        </div>
      </div>
    </div>
  );
}
