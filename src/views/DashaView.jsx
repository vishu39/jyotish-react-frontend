import { useEffect, useState } from "react";
import { Card, Tag, Typography, Spin, Collapse, Progress, Empty, Row, Col } from "antd";
import api from "../api";

const { Title, Text } = Typography;

const PLANET_COLORS = {
  Sun: "#f59e0b", Moon: "#60a5fa", Mars: "#ef4444", Mercury: "#10b981",
  Jupiter: "#eab308", Venus: "#ec4899", Saturn: "#8b5cf6", Rahu: "#6b7280", Ketu: "#a78bfa",
};
const PLANET_SYMBOLS = {
  Sun: "☀", Moon: "☽", Mars: "♂", Mercury: "☿", Jupiter: "♃",
  Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋",
};

function dateRange(start, end) {
  const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short" });
  return `${fmt(start)} — ${fmt(end)}`;
}

function progressPercent(start, end) {
  const now = Date.now();
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (now <= s) return 0;
  if (now >= e) return 100;
  return Math.round(((now - s) / (e - s)) * 100);
}

function isActive(start, end) {
  const now = Date.now();
  return now >= new Date(start).getTime() && now <= new Date(end).getTime();
}

export default function DashaView() {
  const [dashaData, setDashaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/astrology/dashas/current")
      .then(({ data }) => setDashaData(data))
      .catch(() => setDashaData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: 60 }}><Spin size="large" /></div>;

  if (!dashaData?.timeline) {
    return (
      <Empty
        description={
          <Text style={{ color: "var(--text-muted)" }}>
            No Dasha timeline found. Generate your Kundli first from the Kundli section.
          </Text>
        }
        style={{ padding: 60 }}
      />
    );
  }

  const { timeline, activeMahadasha, activeAntardasha } = dashaData;

  const mahadashas = timeline.periods.filter((p) => p.level === "mahadasha");
  const antardashas = timeline.periods.filter((p) => p.level === "antardasha");

  const mahaWithAntar = mahadashas.map((maha, idx) => ({
    ...maha,
    antardashas: antardashas.slice(idx * 9, idx * 9 + 9),
  }));

  const defaultOpen = [String(mahadashas.findIndex((m) => isActive(m.startDate, m.endDate)))];

  return (
    <div className="dasha-view">
      {/* Active dasha highlight cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {activeMahadasha && (
          <Col xs={24} md={12}>
            <div className="dasha-active-card" style={{ background: "var(--stat1)" }}>
              <div className="dasha-active-label">Current Mahadasha</div>
              <div className="dasha-active-planet">
                <span>{PLANET_SYMBOLS[activeMahadasha.planet]}</span>
                {activeMahadasha.planet}
              </div>
              <div className="dasha-active-range">{dateRange(activeMahadasha.startDate, activeMahadasha.endDate)}</div>
              <Progress
                percent={progressPercent(activeMahadasha.startDate, activeMahadasha.endDate)}
                strokeColor="#fff"
                trailColor="rgba(255,255,255,0.25)"
                showInfo={false}
                size="small"
                style={{ marginTop: 12 }}
              />
              <div className="dasha-active-pct">
                {progressPercent(activeMahadasha.startDate, activeMahadasha.endDate)}% elapsed
              </div>
            </div>
          </Col>
        )}
        {activeAntardasha && (
          <Col xs={24} md={12}>
            <div className="dasha-active-card" style={{ background: "var(--stat2)" }}>
              <div className="dasha-active-label">Current Antardasha</div>
              <div className="dasha-active-planet">
                <span>{PLANET_SYMBOLS[activeAntardasha.planet]}</span>
                {activeAntardasha.planet}
              </div>
              <div className="dasha-active-range">{dateRange(activeAntardasha.startDate, activeAntardasha.endDate)}</div>
              <Progress
                percent={progressPercent(activeAntardasha.startDate, activeAntardasha.endDate)}
                strokeColor="#fff"
                trailColor="rgba(255,255,255,0.25)"
                showInfo={false}
                size="small"
                style={{ marginTop: 12 }}
              />
              <div className="dasha-active-pct">
                {progressPercent(activeAntardasha.startDate, activeAntardasha.endDate)}% elapsed
              </div>
            </div>
          </Col>
        )}
        {!activeMahadasha && (
          <Col xs={24}>
            <Empty description={<Text style={{ color: "var(--text-muted)" }}>No active dasha period found.</Text>} />
          </Col>
        )}
      </Row>

      {/* Full Timeline */}
      <Card className="data-card">
        <Title level={5} style={{ color: "var(--text-primary)", marginTop: 0, marginBottom: 16 }}>
          Vimshottari Dasha Timeline
          <Text style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 13, marginLeft: 10 }}>
            Moon Nakshatra: {timeline.baseMoonNakshatra}
          </Text>
        </Title>

        <Collapse
          className="dasha-collapse"
          defaultActiveKey={defaultOpen}
          items={mahaWithAntar.map((maha, idx) => {
            const active = isActive(maha.startDate, maha.endDate);
            return {
              key: String(idx),
              label: (
                <div className="dasha-maha-label">
                  <span className="dasha-planet-dot" style={{ background: PLANET_COLORS[maha.planet] || "#888" }} />
                  <span className="dasha-maha-planet">
                    {PLANET_SYMBOLS[maha.planet]} {maha.planet} Mahadasha
                  </span>
                  <span className="dasha-maha-range">{dateRange(maha.startDate, maha.endDate)}</span>
                  {active && <Tag color="green">Active</Tag>}
                  {maha.isChallenging && <Tag color="red">Challenging</Tag>}
                </div>
              ),
              children: (
                <div className="dasha-antar-list">
                  {maha.antardashas.map((antar, j) => {
                    const antarActive = isActive(antar.startDate, antar.endDate);
                    return (
                      <div key={j} className={`dasha-antar-item ${antarActive ? "antar-active" : ""}`}>
                        <span className="dasha-planet-dot small" style={{ background: PLANET_COLORS[antar.planet] || "#888" }} />
                        <span className="dasha-antar-planet">
                          {PLANET_SYMBOLS[antar.planet]} {antar.planet}
                        </span>
                        <span className="dasha-antar-range">{dateRange(antar.startDate, antar.endDate)}</span>
                        {antarActive && <Tag color="green">Now</Tag>}
                        {antar.isChallenging && <Tag color="orange">Challenging</Tag>}
                      </div>
                    );
                  })}
                </div>
              ),
            };
          })}
        />
      </Card>
    </div>
  );
}
