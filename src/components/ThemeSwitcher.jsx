import { Dropdown, Tooltip } from "antd";
import { BgColorsOutlined, CheckOutlined } from "@ant-design/icons";
import { useTheme, themes } from "../context/ThemeContext.jsx";

export default function ThemeSwitcher() {
  const { themeKey, setThemeKey, currentTheme } = useTheme();

  const menuItems = Object.values(themes).map((t) => ({
    key: t.key,
    label: (
      <div className="theme-menu-item">
        <span className="theme-menu-icon">{t.icon}</span>
        <span className="theme-menu-label">{t.name}</span>
        {themeKey === t.key && <CheckOutlined className="theme-menu-check" />}
      </div>
    ),
    onClick: () => setThemeKey(t.key),
  }));

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Tooltip title="Change Theme" placement="bottom">
        <button className="theme-icon-btn" aria-label="Change theme">
          <BgColorsOutlined />
          <span className="theme-icon-badge">{currentTheme.icon}</span>
        </button>
      </Tooltip>
    </Dropdown>
  );
}
