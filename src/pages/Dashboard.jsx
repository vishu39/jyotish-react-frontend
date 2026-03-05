import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Table, Tag, Typography, Button, Spin, Descriptions, Avatar, message } from "antd";
import { LogoutOutlined, StarOutlined, GlobalOutlined, ThunderboltOutlined, MenuOutlined } from "@ant-design/icons";
import api from "../api";
import Sidebar from "../components/Sidebar.jsx";
import ThemeSwitcher from "../components/ThemeSwitcher.jsx";
import SettingsView from "../components/SettingsView.jsx";
import KundliView from "../views/KundliView.jsx";
import DashaView from "../views/DashaView.jsx";
import RemediesView from "../views/RemediesView.jsx";
import ConsultationsView from "../views/ConsultationsView.jsx";

const { Title, Text } = Typography;

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [rashis, setRashis] = useState([]);
  const [nakshatras, setNakshatras] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [snapshot, setSnapshot] = useState(null);
  const [activeView, setActiveView] = useState("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, rashiRes, nakshatraRes, planetRes, snapshotRes] = await Promise.all([
          api.get("/dashboard/profile"),
          api.get("/dashboard/rashis"),
          api.get("/dashboard/nakshatras"),
          api.get("/dashboard/planets"),
          api.get("/astrology/snapshot").catch(() => ({ data: null })),
        ]);
        setProfile(profileRes.data);
        setRashis(rashiRes.data);
        setNakshatras(nakshatraRes.data);
        setPlanets(planetRes.data);
        setSnapshot(snapshotRes.data);
      } catch {
        message.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const rashiColumns = [
    { title: "Rashi", dataIndex: "name", key: "name", render: (v) => <strong>{v}</strong> },
    { title: "Hindi", dataIndex: "nameHindi", key: "nameHindi" },
    { title: "English", dataIndex: "englishName", key: "englishName" },
    { title: "Lord", dataIndex: "lord", key: "lord" },
    {
      title: "Element", dataIndex: "element", key: "element",
      render: (el) => <Tag color={{ Fire: "volcano", Earth: "green", Air: "geekblue", Water: "cyan" }[el]}>{el}</Tag>,
    },
    { title: "Quality", dataIndex: "quality", key: "quality" },
    { title: "Symbol", dataIndex: "symbol", key: "symbol" },
  ];

  const nakshatraColumns = [
    { title: "Nakshatra", dataIndex: "name", key: "name", render: (v) => <strong>{v}</strong> },
    { title: "Hindi", dataIndex: "nameHindi", key: "nameHindi" },
    { title: "Lord", dataIndex: "lord", key: "lord" },
    { title: "Deity", dataIndex: "deity", key: "deity" },
    { title: "Rashi", dataIndex: "rashi", key: "rashi" },
    { title: "Degrees", key: "degrees", render: (_, r) => `${r.startDegree?.toFixed(2)}° – ${r.endDegree?.toFixed(2)}°` },
  ];

  const planetColumns = [
    { title: "Planet", dataIndex: "name", key: "name", render: (v) => <strong>{v}</strong> },
    { title: "Hindi", dataIndex: "nameHindi", key: "nameHindi" },
    { title: "Sanskrit", dataIndex: "nameSanskrit", key: "nameSanskrit" },
    {
      title: "Nature", dataIndex: "nature", key: "nature",
      render: (n) => <Tag color={{ Benefic: "success", Malefic: "error", Neutral: "warning" }[n]}>{n}</Tag>,
    },
    { title: "Own Sign", dataIndex: "ownSign", key: "ownSign", render: (s) => s?.join(", ") },
    { title: "Exalted In", dataIndex: "exaltedIn", key: "exaltedIn" },
    { title: "Debilitated In", dataIndex: "debilitatedIn", key: "debilitatedIn" },
    { title: "Gemstone", dataIndex: "gemstone", key: "gemstone" },
  ];

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-inner">
          <span className="loading-logo">☸</span>
          <Spin size="large" />
          <Text style={{ color: "var(--text-muted)", marginTop: 12 }}>Loading your Kundli...</Text>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: "Rashis",     sublabel: "Zodiac Signs",   value: rashis.length,     icon: <StarOutlined />,        gradient: "var(--stat1)" },
    { label: "Nakshatras", sublabel: "Lunar Mansions", value: nakshatras.length, icon: <GlobalOutlined />,      gradient: "var(--stat2)" },
    { label: "Navagraha",  sublabel: "Nine Planets",   value: planets.length,    icon: <ThunderboltOutlined />, gradient: "var(--stat3)" },
  ];

  const VIEW_TITLES = {
    overview:      "Overview",
    kundli:        "Kundli — Birth Chart",
    dasha:         "Dasha — Planetary Periods",
    remedies:      "Remedies — Upay",
    consultations: "Consultations",
    rashis:        "Rashis — Zodiac Signs",
    nakshatras:    "Nakshatras — Lunar Mansions",
    planets:       "Navagraha — Nine Planets",
    settings:      "Settings",
  };

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return (
          <div className="tab-content">
            <Row gutter={[20, 20]}>
              {statCards.map((s) => (
                <Col xs={24} sm={8} key={s.label}>
                  <div className="stat-card" style={{ background: s.gradient }}>
                    <div className="stat-icon">{s.icon}</div>
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-sublabel">{s.sublabel}</div>
                  </div>
                </Col>
              ))}
            </Row>
            {snapshot?.chart && (
              <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                {[
                  { label: "Ascendant (Lagna)", value: snapshot.chart.ascendant?.sign, gradient: "var(--stat1)" },
                  { label: "Moon Sign (Rashi)", value: snapshot.chart.moonSign,         gradient: "var(--stat2)" },
                  { label: "Sun Sign",          value: snapshot.chart.sunSign,          gradient: "var(--stat3)" },
                ].map((item) => (
                  <Col xs={24} sm={8} key={item.label}>
                    <div className="lagna-card" style={{ background: item.gradient }}>
                      <div className="lagna-label">{item.label}</div>
                      <div className="lagna-value">{item.value}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            )}
            {profile && (
              <Card className="profile-card" style={{ marginTop: 20 }}>
                <div className="profile-header">
                  <Avatar size={64} style={{ background: "var(--stat1)", fontSize: 24, flexShrink: 0 }}>
                    {profile.name?.[0]?.toUpperCase()}
                  </Avatar>
                  <div>
                    <Title level={4} style={{ margin: 0, color: "var(--text-primary)" }}>{profile.name}</Title>
                    <Text style={{ color: "var(--text-muted)" }}>{profile.email}</Text>
                  </div>
                </div>
                <div className="profile-divider" />
                <Descriptions column={{ xs: 1, sm: 2, lg: 3 }} size="small">
                  <Descriptions.Item label="Date of Birth">
                    {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString("en-IN") : <span style={{ color: "var(--text-muted)" }}>Not set</span>}
                  </Descriptions.Item>
                  <Descriptions.Item label="Birth Time">
                    {profile.birthTime || <span style={{ color: "var(--text-muted)" }}>Not set</span>}
                  </Descriptions.Item>
                  <Descriptions.Item label="Birth Place">
                    {profile.birthPlace || <span style={{ color: "var(--text-muted)" }}>Not set</span>}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            )}
          </div>
        );

      case "kundli":
        return <KundliView snapshot={snapshot} onGenerated={(data) => setSnapshot(data)} />;

      case "dasha":
        return <DashaView />;

      case "remedies":
        return <RemediesView />;

      case "consultations":
        return <ConsultationsView />;

      case "rashis":
        return (
          <Card className="data-card">
            <Table dataSource={rashis} columns={rashiColumns} rowKey="_id" pagination={false} scroll={{ x: true }} className="astro-table"
              expandable={{ expandedRowRender: (r) => <p style={{ color: "var(--text-muted)", margin: 0 }}>{r.description}</p> }} />
          </Card>
        );

      case "nakshatras":
        return (
          <Card className="data-card">
            <Table dataSource={nakshatras} columns={nakshatraColumns} rowKey="_id" pagination={false} scroll={{ x: true }} className="astro-table"
              expandable={{ expandedRowRender: (r) => <p style={{ color: "var(--text-muted)", margin: 0 }}>{r.description}</p> }} />
          </Card>
        );

      case "planets":
        return (
          <Card className="data-card">
            <Table dataSource={planets} columns={planetColumns} rowKey="_id" pagination={false} scroll={{ x: true }} className="astro-table"
              expandable={{ expandedRowRender: (r) => <p style={{ color: "var(--text-muted)", margin: 0 }}>{r.description}</p> }} />
          </Card>
        );

      case "settings":
        return (
          <Card className="data-card">
            <SettingsView profile={profile} onProfileUpdate={setProfile} />
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-root">
      {mobileSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileSidebarOpen(false)} />
      )}

      <div className={`sidebar-wrapper ${mobileSidebarOpen ? "mobile-open" : ""}`}>
        <Sidebar
          active={activeView}
          onChange={(key) => { setActiveView(key); setMobileSidebarOpen(false); }}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
          user={user}
        />
      </div>

      <div className={`dashboard-main ${sidebarCollapsed ? "main-expanded" : ""}`}>
        <header className="dashboard-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setMobileSidebarOpen(true)} aria-label="Open menu">
              <MenuOutlined />
            </button>
            <div className="header-breadcrumb">
              <Text style={{ color: "var(--text-muted)", fontSize: 12 }}>Dashboard</Text>
              <span style={{ color: "var(--border)", margin: "0 6px" }}>/</span>
              <Text style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: 14 }}>
                {VIEW_TITLES[activeView]}
              </Text>
            </div>
          </div>
          <div className="header-right">
            <ThemeSwitcher />
            <div className="header-user">
              <Avatar size={32} style={{ background: "var(--stat1)", fontSize: 14 }}>
                {user.name?.[0]?.toUpperCase()}
              </Avatar>
              <span className="header-username">{user.name}</span>
            </div>
            <Button icon={<LogoutOutlined />} onClick={logout} className="logout-btn">Logout</Button>
          </div>
        </header>

        <main className="dashboard-content">
          <div className="page-title-row">
            <Title level={3} style={{ margin: 0, color: "var(--text-primary)" }}>
              {VIEW_TITLES[activeView]}
            </Title>
          </div>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
