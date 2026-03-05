import { Avatar, Typography } from "antd";
import {
  AppstoreOutlined,
  StarOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RadarChartOutlined,
  ClockCircleOutlined,
  MedicineBoxOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const NAV_ITEMS = [
  { key: "overview",      label: "Overview",       icon: <AppstoreOutlined />,    section: null },
  { key: "s1",            section: "My Astrology" },
  { key: "kundli",        label: "Kundli",          icon: <RadarChartOutlined />,  section: null },
  { key: "dasha",         label: "Dasha",           icon: <ClockCircleOutlined />, section: null },
  { key: "remedies",      label: "Remedies",        icon: <MedicineBoxOutlined />, section: null },
  { key: "consultations", label: "Consultations",   icon: <TeamOutlined />,        section: null },
  { key: "s2",            section: "Reference" },
  { key: "rashis",        label: "Rashis",          icon: <StarOutlined />,        section: null },
  { key: "nakshatras",    label: "Nakshatras",      icon: <GlobalOutlined />,      section: null },
  { key: "planets",       label: "Navagraha",       icon: <ThunderboltOutlined />, section: null },
  { key: "s3",            section: "Account" },
  { key: "settings",      label: "Settings",        icon: <SettingOutlined />,     section: null },
];

export default function Sidebar({ active, onChange, collapsed, onToggle, user }) {
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">☸</span>
        {!collapsed && <span className="sidebar-logo-text">Jyotish</span>}
        <button className="sidebar-collapse-btn" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          if (item.section && !item.label) {
            return (
              <div key={item.key} className={`sidebar-section-label ${collapsed ? "hidden" : ""}`}>
                {item.section}
              </div>
            );
          }
          return (
            <button
              key={item.key}
              className={`sidebar-item ${active === item.key ? "active" : ""}`}
              onClick={() => onChange(item.key)}
              title={collapsed ? item.label : undefined}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              {!collapsed && <span className="sidebar-item-label">{item.label}</span>}
              {active === item.key && <span className="sidebar-active-bar" />}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-user">
        <Avatar size={36} style={{ background: "var(--stat1)", flexShrink: 0, fontSize: 15 }}>
          {user?.name?.[0]?.toUpperCase()}
        </Avatar>
        {!collapsed && (
          <div className="sidebar-user-info">
            <Text className="sidebar-user-name">{user?.name}</Text>
            <Text className="sidebar-user-email">{user?.email}</Text>
          </div>
        )}
      </div>
    </aside>
  );
}
