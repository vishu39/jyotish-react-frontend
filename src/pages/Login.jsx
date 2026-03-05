import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import api from "../api";
import ThemeSwitcher from "../components/ThemeSwitcher.jsx";

const { Title, Text } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", values);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      message.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      message.error(err.response?.data?.message || "Login failed");
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

      <div className="auth-card">
        <div className="auth-logo">
          <span className="auth-logo-icon">☸</span>
        </div>
        <Title level={2} className="auth-title">Jyotish</Title>
        <Text className="auth-subtitle">Vedic Astrology Dashboard</Text>

        <Form name="login" onFinish={onFinish} size="large" className="auth-form">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="input-icon" />}
              placeholder="Email address"
              className="auth-input"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="input-icon" />}
              placeholder="Password"
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
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <Text className="auth-link-text">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="auth-link">
            Create account
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
