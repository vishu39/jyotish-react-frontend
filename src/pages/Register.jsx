import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  DatePicker,
  TimePicker,
  message,
} from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import api from "../api";

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
    <div className="login-container">
      <Card className="login-card">
        <Title level={2} className="login-title">
          Create Account
        </Title>
        <Text className="login-subtitle" style={{ display: "block" }}>
          Enter your birth details for Kundli
        </Text>
        <Form name="register" onFinish={onFinish} size="large">
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Full Name" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 6, message: "Minimum 6 characters" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item name="dateOfBirth">
            <DatePicker
              placeholder="Date of Birth"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="birthTime">
            <TimePicker
              placeholder="Birth Time"
              format="HH:mm"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="birthPlace">
            <Input placeholder="Birth Place (e.g., Delhi, India)" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Register
            </Button>
          </Form.Item>
          <Text>
            Already have an account? <Link to="/login">Log In</Link>
          </Text>
        </Form>
      </Card>
    </div>
  );
}
