import { Avatar, Typography } from "antd";
import {
  AppstoreOutlined,
  StarOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const NAV_ITEMS = [
  { key: "overview",   label: "Overview",   icon: <AppstoreOutlined /> },
  { key: "rashis",     label: "Rashis",      icon: <StarOutlined /> },
  { key: "nakshatras", label: "Nakshatras",  icon: <GlobalOutlined /> },
  { key: "planets",    label: "Navagraha",   icon: <ThunderboltOutlined /> },
  { key: "settings",   label: "Settings",    icon: <SettingOutlined /> },
];

export default function Sidebar({ active, onChange, collapsed, onToggle, user }) {
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">☸</span>
        {!collapsed && (
          <span className="sidebar-logo-text">Jyotish</span>
        )}
        <button className="sidebar-collapse-btn" onClick={onToggle} aria-label="Toggle sidebar">
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
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
        ))}
      </nav>

      {/* User section at bottom */}
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
