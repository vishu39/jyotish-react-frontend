import { useEffect, useState } from "react";
import { Card, Tag, Typography, Spin, Button, Empty, Badge, Tooltip, message, Progress } from "antd";
import {
  CheckOutlined, FireOutlined, StarOutlined, HeartOutlined,
  GiftOutlined, BulbOutlined, UserOutlined,
} from "@ant-design/icons";
import api from "../api";

const { Title, Text } = Typography;

const TYPE_CONFIG = {
  mantra:    { color: "purple", icon: <BulbOutlined />,  label: "Mantra" },
  gemstone:  { color: "cyan",   icon: <StarOutlined />,  label: "Gemstone" },
  fasting:   { color: "orange", icon: <FireOutlined />,  label: "Fasting" },
  donation:  { color: "green",  icon: <GiftOutlined />,  label: "Donation" },
  pooja:     { color: "gold",   icon: <HeartOutlined />, label: "Pooja" },
  lifestyle: { color: "blue",   icon: <UserOutlined />,  label: "Lifestyle" },
};

const PRIORITY_LABELS = { 5: "Critical", 4: "High", 3: "Medium", 2: "Low", 1: "Optional" };
const PRIORITY_COLORS = { 5: "red", 4: "orange", 3: "blue", 2: "green", 1: "default" };

const PLANET_SYMBOLS = {
  Sun: "☀", Moon: "☽", Mars: "♂", Mercury: "☿", Jupiter: "♃",
  Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋",
};

export default function RemediesView() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState({});

  useEffect(() => {
    api.get("/astrology/remedies/active")
      .then(({ data }) => setPlan(data))
      .catch(() => setPlan(null))
      .finally(() => setLoading(false));
  }, []);

  const trackRemedy = async (remedyTitle) => {
    if (!plan?._id) return;
    setTracking((t) => ({ ...t, [remedyTitle]: true }));
    try {
      const { data } = await api.post(`/astrology/remedies/${plan._id}/track`, { remedyTitle });
      setPlan(data.plan);
      message.success(`Logged: ${remedyTitle}`);
    } catch {
      message.error("Failed to log remedy");
    } finally {
      setTracking((t) => ({ ...t, [remedyTitle]: false }));
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60 }}><Spin size="large" /></div>;

  if (!plan) {
    return (
      <Empty
        description={
          <Text style={{ color: "var(--text-muted)" }}>
            No active remedy plan. Generate your Kundli first.
          </Text>
        }
        style={{ padding: 60 }}
      />
    );
  }

  const validFrom = new Date(plan.validFrom).toLocaleDateString("en-IN");
  const validTo = new Date(plan.validTo).toLocaleDateString("en-IN");
  const daysTotal = Math.round((new Date(plan.validTo) - new Date(plan.validFrom)) / 86400000);
  const daysGone = Math.round((Date.now() - new Date(plan.validFrom)) / 86400000);
  const planProgress = Math.min(100, Math.round((daysGone / daysTotal) * 100));

  // Count tracking per remedy
  const logCounts = plan.trackingLog?.reduce((acc, entry) => {
    acc[entry.remedyTitle] = (acc[entry.remedyTitle] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="remedies-view">
      {/* Plan overview */}
      <Card className="data-card" style={{ marginBottom: 20 }}>
        <div className="remedy-plan-header">
          <div>
            <Title level={5} style={{ color: "var(--text-primary)", margin: 0 }}>
              Active Remedy Plan
            </Title>
            <Text style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Valid: {validFrom} → {validTo}
            </Text>
          </div>
          <Badge
            count={plan.remedies?.length}
            style={{ background: "var(--accent)" }}
          >
            <Tag color="green" style={{ fontSize: 13, padding: "4px 12px" }}>Active</Tag>
          </Badge>
        </div>

        <Progress
          percent={planProgress}
          strokeColor="var(--accent)"
          trailColor="var(--accent-soft)"
          style={{ marginTop: 12 }}
          format={(p) => <span style={{ color: "var(--text-muted)" }}>{p}%</span>}
        />

        {plan.goals?.length > 0 && (
          <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {plan.goals.map((g, i) => (
              <Tag key={i} style={{ background: "var(--accent-soft)", borderColor: "var(--border)" }}>
                {g}
              </Tag>
            ))}
          </div>
        )}
      </Card>

      {/* Remedy cards */}
      <div className="remedy-grid">
        {plan.remedies?.map((remedy, i) => {
          const cfg = TYPE_CONFIG[remedy.type] || TYPE_CONFIG.lifestyle;
          const doneCount = logCounts?.[remedy.title] || 0;
          return (
            <Card key={i} className="remedy-card data-card">
              <div className="remedy-card-top">
                <div className="remedy-type-badge" style={{ background: "var(--accent-soft)" }}>
                  {cfg.icon}
                  <span>{cfg.label}</span>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Tooltip title={`Priority: ${PRIORITY_LABELS[remedy.priority]}`}>
                    <Tag color={PRIORITY_COLORS[remedy.priority] || "default"}>
                      P{remedy.priority}
                    </Tag>
                  </Tooltip>
                  {doneCount > 0 && (
                    <Tooltip title={`Completed ${doneCount} time(s)`}>
                      <Tag color="green" icon={<CheckOutlined />}>{doneCount}×</Tag>
                    </Tooltip>
                  )}
                </div>
              </div>

              <Title level={5} style={{ color: "var(--text-primary)", margin: "12px 0 4px" }}>
                {remedy.title}
              </Title>

              {remedy.targetPlanet && (
                <Text style={{ color: "var(--accent)", fontSize: 13, display: "block", marginBottom: 8 }}>
                  {PLANET_SYMBOLS[remedy.targetPlanet]} For {remedy.targetPlanet}
                </Text>
              )}

              <Text style={{ color: "var(--text-muted)", fontSize: 13, display: "block", marginBottom: 12 }}>
                {remedy.description}
              </Text>

              <div className="remedy-meta">
                {remedy.frequency && (
                  <span className="remedy-meta-item">🔁 {remedy.frequency}</span>
                )}
                {remedy.durationDays && (
                  <span className="remedy-meta-item">📅 {remedy.durationDays} days</span>
                )}
              </div>

              {remedy.precautions && (
                <Text style={{ color: "var(--text-muted)", fontSize: 12, fontStyle: "italic", display: "block", marginTop: 8 }}>
                  ⚠ {remedy.precautions}
                </Text>
              )}

              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                loading={tracking[remedy.title]}
                onClick={() => trackRemedy(remedy.title)}
                style={{
                  marginTop: 14,
                  background: "var(--accent)",
                  borderColor: "var(--accent)",
                  borderRadius: 8,
                }}
              >
                Mark Done Today
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Tracking log */}
      {plan.trackingLog?.length > 0 && (
        <Card className="data-card" style={{ marginTop: 20 }}>
          <Title level={5} style={{ color: "var(--text-primary)", marginTop: 0 }}>
            Recent Progress Log
          </Title>
          <div className="tracking-log">
            {[...plan.trackingLog].reverse().slice(0, 10).map((entry, i) => (
              <div key={i} className="tracking-log-item">
                <CheckOutlined style={{ color: "var(--accent)" }} />
                <div>
                  <Text style={{ color: "var(--text-primary)", fontWeight: 500, fontSize: 13 }}>
                    {entry.remedyTitle}
                  </Text>
                  <Text style={{ color: "var(--text-muted)", fontSize: 12, display: "block" }}>
                    {new Date(entry.completedAt).toLocaleString("en-IN")}
                    {entry.notes ? ` · ${entry.notes}` : ""}
                  </Text>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
