import { useState } from "react";
import { Button, Table, Tag, Card, Row, Col, Typography, Spin, Empty, Tooltip, Badge } from "antd";
import { ThunderboltOutlined, ReloadOutlined, InfoCircleOutlined } from "@ant-design/icons";
import api from "../api";

const { Title, Text } = Typography;

const DIGNITY_COLORS = {
  exalted: "gold",
  "own-sign": "green",
  debilitated: "red",
  friendly: "cyan",
  neutral: "default",
  enemy: "volcano",
};

const PLANET_SYMBOLS = {
  Sun: "☀", Moon: "☽", Mars: "♂", Mercury: "☿", Jupiter: "♃",
  Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋",
};

export default function KundliView({ snapshot, onGenerated }) {
  const [generating, setGenerating] = useState(false);

  const chart = snapshot?.chart;

  const generate = async () => {
    setGenerating(true);
    try {
      const { data } = await api.post("/astrology/generate");
      onGenerated(data);
    } catch (err) {
      const msg = err.response?.data?.message || "Generation failed";
      // Show error inline
      console.error(msg);
      alert(msg);
    } finally {
      setGenerating(false);
    }
  };

  if (!chart) {
    return (
      <div className="kundli-empty">
        <div className="kundli-empty-inner">
          <div className="kundli-empty-icon">☸</div>
          <Title level={3} style={{ color: "var(--text-primary)", margin: "16px 0 8px" }}>
            Your Kundli is not generated yet
          </Title>
          <Text style={{ color: "var(--text-muted)", display: "block", marginBottom: 28 }}>
            Make sure your birth date and birth place are set in Settings, then generate your chart.
          </Text>
          <Button
            type="primary"
            size="large"
            icon={<ThunderboltOutlined />}
            loading={generating}
            onClick={generate}
            className="auth-btn"
            style={{ width: "auto", padding: "0 36px" }}
          >
            Generate My Kundli
          </Button>
        </div>
      </div>
    );
  }

  const planetColumns = [
    {
      title: "Planet",
      dataIndex: "planet",
      key: "planet",
      render: (v) => (
        <span style={{ fontWeight: 600 }}>
          <span style={{ marginRight: 6, fontSize: 16 }}>{PLANET_SYMBOLS[v]}</span>{v}
        </span>
      ),
    },
    { title: "Sign", dataIndex: "sign", key: "sign" },
    { title: "House", dataIndex: "house", key: "house", render: (v) => `H${v}` },
    { title: "Nakshatra", dataIndex: "nakshatra", key: "nakshatra" },
    { title: "Pada", dataIndex: "pada", key: "pada" },
    { title: "Degree", dataIndex: "degree", key: "degree", render: (v) => `${v}°` },
    {
      title: "Dignity",
      dataIndex: "dignity",
      key: "dignity",
      render: (v) => <Tag color={DIGNITY_COLORS[v] || "default"}>{v}</Tag>,
    },
    {
      title: "Flags",
      key: "flags",
      render: (_, r) => (
        <>
          {r.retrograde && <Tag color="purple">℞ Retro</Tag>}
          {r.combust && <Tag color="orange">Combust</Tag>}
        </>
      ),
    },
  ];

  const houseColumns = [
    { title: "House", dataIndex: "houseNumber", key: "houseNumber", render: (v) => `H${v}` },
    { title: "Sign", dataIndex: "sign", key: "sign" },
    { title: "Lord", dataIndex: "lord", key: "lord" },
    {
      title: "Occupants",
      dataIndex: "occupants",
      key: "occupants",
      render: (v) => v?.length
        ? v.map((p) => <Tag key={p} style={{ marginBottom: 2 }}>{PLANET_SYMBOLS[p]} {p}</Tag>)
        : <Text style={{ color: "var(--text-muted)" }}>—</Text>,
    },
  ];

  return (
    <div className="kundli-view">
      {/* Header row */}
      <div className="kundli-header-row">
        <div>
          <Text style={{ color: "var(--text-muted)", fontSize: 12 }}>
            Generated on {new Date(chart.calculatedAt).toLocaleDateString("en-IN")} ·{" "}
            {chart.ayanamsa} ayanamsa · {chart.chartSystem} style
          </Text>
        </div>
        <Button
          icon={<ReloadOutlined />}
          loading={generating}
          onClick={generate}
          className="logout-btn"
        >
          Regenerate
        </Button>
      </div>

      {/* Key signs */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {[
          { label: "Ascendant (Lagna)", value: chart.ascendant?.sign, sub: `${chart.ascendant?.degree}° · ${chart.ascendant?.nakshatra} Pada ${chart.ascendant?.pada}`, gradient: "var(--stat1)" },
          { label: "Moon Sign (Rashi)", value: chart.moonSign, sub: "Chandra Lagna", gradient: "var(--stat2)" },
          { label: "Sun Sign", value: chart.sunSign, sub: "Surya Rashi", gradient: "var(--stat3)" },
        ].map((item) => (
          <Col xs={24} sm={8} key={item.label}>
            <div className="lagna-card" style={{ background: item.gradient }}>
              <div className="lagna-label">{item.label}</div>
              <div className="lagna-value">{item.value}</div>
              <div className="lagna-sub">{item.sub}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Yogas */}
      {chart.yogas?.length > 0 && (
        <Card className="data-card" style={{ marginBottom: 20 }}>
          <Title level={5} style={{ color: "var(--text-primary)", marginTop: 0 }}>
            Yogas Detected
          </Title>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {chart.yogas.map((y, i) => (
              <Tooltip key={i} title={`Confidence: ${y.confidence}%`}>
                <Tag
                  color={y.category === "raja" ? "gold" : y.category === "dhana" ? "green" : y.category === "arista" ? "red" : "blue"}
                  style={{ padding: "4px 12px", fontSize: 13 }}
                >
                  {y.name}
                </Tag>
              </Tooltip>
            ))}
          </div>
        </Card>
      )}

      {/* Planetary Positions */}
      <Card className="data-card" style={{ marginBottom: 20 }}>
        <Title level={5} style={{ color: "var(--text-primary)", marginTop: 0 }}>
          Planetary Positions (Graha Sthiti)
        </Title>
        <Table
          dataSource={chart.planetaryPositions}
          columns={planetColumns}
          rowKey="planet"
          pagination={false}
          scroll={{ x: true }}
          className="astro-table"
          size="small"
        />
      </Card>

      {/* Houses */}
      <Card className="data-card">
        <Title level={5} style={{ color: "var(--text-primary)", marginTop: 0 }}>
          Bhava Chakra (12 Houses)
        </Title>
        <Table
          dataSource={chart.houses}
          columns={houseColumns}
          rowKey="houseNumber"
          pagination={false}
          scroll={{ x: true }}
          className="astro-table"
          size="small"
        />
      </Card>

      {chart.notes && (
        <div className="kundli-note">
          <InfoCircleOutlined style={{ color: "var(--accent)", marginRight: 8 }} />
          <Text style={{ color: "var(--text-muted)", fontSize: 12 }}>{chart.notes}</Text>
        </div>
      )}
    </div>
  );
}
