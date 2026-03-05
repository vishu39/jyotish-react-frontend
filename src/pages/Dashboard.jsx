import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Card,
  Row,
  Col,
  Table,
  Tag,
  Tabs,
  Typography,
  Button,
  Spin,
  Statistic,
  Descriptions,
  message,
} from "antd";
import {
  LogoutOutlined,
  StarOutlined,
  GlobalOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import api from "../api";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [rashis, setRashis] = useState([]);
  const [nakshatras, setNakshatras] = useState([]);
  const [planets, setPlanets] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, rashiRes, nakshatraRes, planetRes] =
          await Promise.all([
            api.get("/dashboard/profile"),
            api.get("/dashboard/rashis"),
            api.get("/dashboard/nakshatras"),
            api.get("/dashboard/planets"),
          ]);
        setProfile(profileRes.data);
        setRashis(rashiRes.data);
        setNakshatras(nakshatraRes.data);
        setPlanets(planetRes.data);
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
    { title: "Rashi", dataIndex: "name", key: "name" },
    { title: "Hindi", dataIndex: "nameHindi", key: "nameHindi" },
    { title: "English", dataIndex: "englishName", key: "englishName" },
    { title: "Lord", dataIndex: "lord", key: "lord" },
    {
      title: "Element",
      dataIndex: "element",
      key: "element",
      render: (el) => {
        const colors = { Fire: "red", Earth: "green", Air: "blue", Water: "cyan" };
        return <Tag color={colors[el]}>{el}</Tag>;
      },
    },
    { title: "Quality", dataIndex: "quality", key: "quality" },
    { title: "Symbol", dataIndex: "symbol", key: "symbol" },
  ];

  const nakshatraColumns = [
    { title: "Nakshatra", dataIndex: "name", key: "name" },
    { title: "Hindi", dataIndex: "nameHindi", key: "nameHindi" },
    { title: "Lord", dataIndex: "lord", key: "lord" },
    { title: "Deity", dataIndex: "deity", key: "deity" },
    { title: "Rashi", dataIndex: "rashi", key: "rashi" },
    {
      title: "Degrees",
      key: "degrees",
      render: (_, r) => `${r.startDegree?.toFixed(2)} - ${r.endDegree?.toFixed(2)}`,
    },
  ];

  const planetColumns = [
    { title: "Planet", dataIndex: "name", key: "name" },
    { title: "Hindi", dataIndex: "nameHindi", key: "nameHindi" },
    { title: "Sanskrit", dataIndex: "nameSanskrit", key: "nameSanskrit" },
    {
      title: "Nature",
      dataIndex: "nature",
      key: "nature",
      render: (n) => {
        const colors = { Benefic: "green", Malefic: "red", Neutral: "orange" };
        return <Tag color={colors[n]}>{n}</Tag>;
      },
    },
    {
      title: "Own Sign",
      dataIndex: "ownSign",
      key: "ownSign",
      render: (signs) => signs?.join(", "),
    },
    { title: "Exalted In", dataIndex: "exaltedIn", key: "exaltedIn" },
    { title: "Debilitated In", dataIndex: "debilitatedIn", key: "debilitatedIn" },
    { title: "Gemstone", dataIndex: "gemstone", key: "gemstone" },
    { title: "Day", dataIndex: "day", key: "day" },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  const tabItems = [
    {
      key: "overview",
      label: "Overview",
      icon: <UserOutlined />,
      children: (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic title="Rashis (Zodiac Signs)" value={rashis.length} prefix={<StarOutlined />} />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic title="Nakshatras (Lunar Mansions)" value={nakshatras.length} prefix={<GlobalOutlined />} />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic title="Grahas (Planets)" value={planets.length} prefix={<ThunderboltOutlined />} />
              </Card>
            </Col>
          </Row>
          {profile && (
            <Card title="Your Profile" style={{ marginTop: 16 }}>
              <Descriptions column={{ xs: 1, sm: 2 }}>
                <Descriptions.Item label="Name">{profile.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
                <Descriptions.Item label="Date of Birth">
                  {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString("en-IN") : "Not set"}
                </Descriptions.Item>
                <Descriptions.Item label="Birth Time">{profile.birthTime || "Not set"}</Descriptions.Item>
                <Descriptions.Item label="Birth Place">{profile.birthPlace || "Not set"}</Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </>
      ),
    },
    {
      key: "rashis",
      label: "Rashis",
      icon: <StarOutlined />,
      children: (
        <Card title="12 Rashis (Zodiac Signs)">
          <Table
            dataSource={rashis}
            columns={rashiColumns}
            rowKey="_id"
            pagination={false}
            scroll={{ x: true }}
            expandable={{
              expandedRowRender: (r) => <p>{r.description}</p>,
            }}
          />
        </Card>
      ),
    },
    {
      key: "nakshatras",
      label: "Nakshatras",
      icon: <GlobalOutlined />,
      children: (
        <Card title="27 Nakshatras (Lunar Mansions)">
          <Table
            dataSource={nakshatras}
            columns={nakshatraColumns}
            rowKey="_id"
            pagination={false}
            scroll={{ x: true }}
            expandable={{
              expandedRowRender: (r) => <p>{r.description}</p>,
            }}
          />
        </Card>
      ),
    },
    {
      key: "planets",
      label: "Navagraha",
      icon: <ThunderboltOutlined />,
      children: (
        <Card title="9 Grahas (Navagraha - Nine Planets)">
          <Table
            dataSource={planets}
            columns={planetColumns}
            rowKey="_id"
            pagination={false}
            scroll={{ x: true }}
            expandable={{
              expandedRowRender: (r) => <p>{r.description}</p>,
            }}
          />
        </Card>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#fff",
          padding: "0 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <Title level={3} style={{ margin: 0, color: "#764ba2" }}>
          Jyotish App
        </Title>
        <div>
          <span style={{ marginRight: 16 }}>Namaste, {user.name}</span>
          <Button icon={<LogoutOutlined />} onClick={logout}>
            Logout
          </Button>
        </div>
      </Header>
      <Content style={{ padding: 24 }}>
        <Tabs items={tabItems} size="large" />
      </Content>
    </Layout>
  );
}
