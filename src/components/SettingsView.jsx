import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Typography,
  Avatar,
  message,
  Divider,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  EnvironmentOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import api from "../api";

const { Title, Text } = Typography;

export default function SettingsView({ profile, onProfileUpdate }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        name: profile.name,
        dateOfBirth: profile.dateOfBirth ? dayjs(profile.dateOfBirth) : null,
        birthTime: profile.birthTime ? dayjs(profile.birthTime, "HH:mm") : null,
        birthPlace: profile.birthPlace,
      });
    }
  }, [profile, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        dateOfBirth: values.dateOfBirth?.toISOString(),
        birthTime: values.birthTime?.format("HH:mm"),
        birthPlace: values.birthPlace,
      };
      const { data } = await api.put("/dashboard/profile", payload);
      // Update localStorage name
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...stored, name: data.name }));
      onProfileUpdate(data);
      message.success("Profile updated successfully!");
    } catch (err) {
      message.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-view">
      {/* Profile avatar section */}
      <div className="settings-avatar-section">
        <Avatar
          size={80}
          style={{ background: "var(--stat1)", fontSize: 32 }}
        >
          {profile?.name?.[0]?.toUpperCase()}
        </Avatar>
        <div>
          <Title level={4} style={{ margin: 0, color: "var(--text-primary)" }}>
            {profile?.name}
          </Title>
          <Text style={{ color: "var(--text-muted)", fontSize: 13 }}>
            {profile?.email}
          </Text>
        </div>
      </div>

      <Divider style={{ borderColor: "var(--border)" }} />

      <div className="settings-section">
        <Title level={5} style={{ color: "var(--text-primary)", marginTop: 0 }}>
          Personal Information
        </Title>
        <Text style={{ color: "var(--text-muted)", fontSize: 13, display: "block", marginBottom: 20 }}>
          Update your name and birth details for Kundli calculation.
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
          className="settings-form"
        >
          <div className="settings-form-grid">
            <Form.Item
              name="name"
              label={<span style={{ color: "var(--text-muted)" }}>Full Name</span>}
              rules={[{ required: true, message: "Name is required" }]}
            >
              <Input prefix={<UserOutlined style={{ color: "var(--text-muted)" }} />} placeholder="Full Name" />
            </Form.Item>

            <Form.Item
              name="dateOfBirth"
              label={<span style={{ color: "var(--text-muted)" }}>Date of Birth</span>}
            >
              <DatePicker placeholder="Select date" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="birthTime"
              label={<span style={{ color: "var(--text-muted)" }}>Birth Time</span>}
            >
              <TimePicker placeholder="Select time" format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="birthPlace"
              label={<span style={{ color: "var(--text-muted)" }}>Birth Place</span>}
            >
              <Input
                prefix={<EnvironmentOutlined style={{ color: "var(--text-muted)" }} />}
                placeholder="e.g. Delhi, India"
              />
            </Form.Item>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              className="settings-save-btn"
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </div>

      <Divider style={{ borderColor: "var(--border)" }} />

      <div className="settings-section">
        <Title level={5} style={{ color: "var(--text-primary)", marginTop: 0 }}>
          Account
        </Title>
        <div className="settings-info-row">
          <MailOutlined style={{ color: "var(--text-muted)" }} />
          <div>
            <Text style={{ color: "var(--text-muted)", fontSize: 12, display: "block" }}>Email address</Text>
            <Text style={{ color: "var(--text-primary)", fontWeight: 500 }}>{profile?.email}</Text>
          </div>
        </div>
        <Text style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8, display: "block" }}>
          Email cannot be changed. Contact support if needed.
        </Text>
      </div>
    </div>
  );
}
