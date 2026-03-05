import { useEffect, useState } from "react";
import {
  Card, Tag, Typography, Spin, Button, Empty, Modal, Form,
  Select, DatePicker, InputNumber, Input, Tabs, message, Avatar,
} from "antd";
import { CalendarOutlined, UserOutlined, VideoCameraOutlined, AudioOutlined, MessageOutlined } from "@ant-design/icons";
import api from "../api";

const { Title, Text } = Typography;

const STATUS_COLORS = {
  requested: "blue", confirmed: "green", completed: "cyan",
  cancelled: "red", "no-show": "orange",
};
const MODE_ICONS = {
  chat: <MessageOutlined />, audio: <AudioOutlined />, video: <VideoCameraOutlined />,
};
const TOPICS = ["career", "marriage", "health", "finance", "education", "general"];
const MODES  = ["chat", "audio", "video"];

export default function ConsultationsView() {
  const [astrologers, setAstrologers] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAstrologer, setSelectedAstrologer] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    Promise.all([
      api.get("/consultations/astrologers"),
      api.get("/consultations/mine"),
    ]).then(([aRes, cRes]) => {
      setAstrologers(aRes.data);
      setConsultations(cRes.data);
    }).catch(() => message.error("Failed to load consultations"))
      .finally(() => setLoading(false));
  }, []);

  const openBook = (astrologer) => {
    setSelectedAstrologer(astrologer);
    form.resetFields();
    setModalOpen(true);
  };

  const submitBooking = async (values) => {
    setBooking(true);
    try {
      await api.post("/consultations/", {
        astrologerId: selectedAstrologer._id,
        topic: values.topic,
        mode: values.mode,
        scheduledAt: values.scheduledAt?.toISOString(),
        durationMinutes: values.durationMinutes,
        notesByUser: values.notesByUser,
      });
      message.success("Consultation booked successfully!");
      setModalOpen(false);
      const { data } = await api.get("/consultations/mine");
      setConsultations(data);
    } catch (err) {
      message.error(err.response?.data?.message || "Booking failed");
    } finally {
      setBooking(false);
    }
  };

  const cancelConsultation = async (id) => {
    try {
      await api.patch(`/consultations/${id}/status`, { status: "cancelled", cancelledReason: "Cancelled by user" });
      setConsultations((prev) =>
        prev.map((c) => c._id === id ? { ...c, status: "cancelled" } : c)
      );
      message.success("Consultation cancelled");
    } catch {
      message.error("Failed to cancel");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60 }}><Spin size="large" /></div>;

  const tabItems = [
    {
      key: "astrologers",
      label: "Find Astrologers",
      children: astrologers.length === 0 ? (
        <Empty description={<Text style={{ color: "var(--text-muted)" }}>No astrologers available yet.</Text>} style={{ padding: 60 }} />
      ) : (
        <div className="astrologer-grid">
          {astrologers.map((a) => (
            <Card key={a._id} className="astrologer-card data-card">
              <div className="astrologer-header">
                <Avatar size={52} style={{ background: "var(--stat1)", fontSize: 20 }}>
                  {a.name?.[0]?.toUpperCase()}
                </Avatar>
                <div>
                  <Title level={5} style={{ margin: 0, color: "var(--text-primary)" }}>{a.name}</Title>
                  <Text style={{ color: "var(--text-muted)", fontSize: 12 }}>{a.email}</Text>
                </div>
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {a.preferredLanguage && <Tag>{a.preferredLanguage.toUpperCase()}</Tag>}
                {a.timezone && <Tag>{a.timezone}</Tag>}
              </div>
              <Button
                type="primary"
                block
                icon={<CalendarOutlined />}
                style={{ marginTop: 16, background: "var(--accent)", borderColor: "var(--accent)", borderRadius: 10 }}
                onClick={() => openBook(a)}
              >
                Book Consultation
              </Button>
            </Card>
          ))}
        </div>
      ),
    },
    {
      key: "mine",
      label: `My Consultations${consultations.length ? ` (${consultations.length})` : ""}`,
      children: consultations.length === 0 ? (
        <Empty description={<Text style={{ color: "var(--text-muted)" }}>No consultations yet. Book your first one!</Text>} style={{ padding: 60 }} />
      ) : (
        <div className="consultation-list">
          {consultations.map((c) => (
            <Card key={c._id} className="consultation-item data-card">
              <div className="consultation-row">
                <div className="consultation-info">
                  <div className="consultation-mode">
                    {MODE_ICONS[c.mode]}
                    <span style={{ textTransform: "capitalize" }}>{c.mode}</span>
                  </div>
                  <Title level={5} style={{ margin: "8px 0 4px", color: "var(--text-primary)" }}>
                    {c.topic?.charAt(0).toUpperCase() + c.topic?.slice(1)} Consultation
                  </Title>
                  <Text style={{ color: "var(--text-muted)", fontSize: 13 }}>
                    With {c.astrologer?.name || "Astrologer"} ·{" "}
                    {new Date(c.scheduledAt).toLocaleString("en-IN")} ·{" "}
                    {c.durationMinutes} min
                  </Text>
                  {c.notesByUser && (
                    <Text style={{ color: "var(--text-muted)", fontSize: 12, display: "block", marginTop: 4 }}>
                      Note: {c.notesByUser}
                    </Text>
                  )}
                </div>
                <div className="consultation-actions">
                  <Tag color={STATUS_COLORS[c.status]} style={{ fontSize: 13, padding: "3px 10px" }}>
                    {c.status}
                  </Tag>
                  {["requested", "confirmed"].includes(c.status) && (
                    <Button
                      size="small"
                      danger
                      style={{ marginTop: 8, borderRadius: 8 }}
                      onClick={() => cancelConsultation(c._id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="consultations-view">
      <Tabs items={tabItems} className="dashboard-tabs" />

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title={
          <Text style={{ color: "var(--text-primary)", fontSize: 16, fontWeight: 600 }}>
            Book with {selectedAstrologer?.name}
          </Text>
        }
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={submitBooking} style={{ marginTop: 16 }}>
          <Form.Item name="topic" label="Topic" rules={[{ required: true }]} initialValue="general">
            <Select options={TOPICS.map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))} />
          </Form.Item>
          <Form.Item name="mode" label="Mode" rules={[{ required: true }]} initialValue="chat">
            <Select options={MODES.map((m) => ({ value: m, label: m.charAt(0).toUpperCase() + m.slice(1) }))} />
          </Form.Item>
          <Form.Item name="scheduledAt" label="Date & Time" rules={[{ required: true, message: "Select date & time" }]}>
            <DatePicker showTime format="DD MMM YYYY HH:mm" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="durationMinutes" label="Duration (minutes)" initialValue={30}>
            <InputNumber min={15} max={180} step={15} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="notesByUser" label="Notes (optional)">
            <Input.TextArea rows={2} placeholder="Describe your question or concern..." />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={booking}
              block
              style={{ background: "var(--accent)", borderColor: "var(--accent)", borderRadius: 10, height: 44 }}
            >
              Confirm Booking
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
