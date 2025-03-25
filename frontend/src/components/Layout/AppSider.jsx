import { Layout, Card, Statistic, Typography, List, Tag } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { capitalize } from "../../utils";
import { useContext } from "react";
import CryptoContext from "../../context/crypto-context";
const siderStyle = {
  padding: "1rem",
};
const statisticStyle = {
  marginBottom: "1rem",
};

export default function AppSider() {
  const { assets } = useContext(CryptoContext);

  return (
    <Layout.Sider width="25%" style={siderStyle}>
      {assets.map((asset) => (
        <Card key={asset.id} style={statisticStyle}>
          <Statistic
            title={capitalize(asset.id)}
            value={asset.totalAmount}
            precision={2}
            valueStyle={{
              color: asset.grow ? "#3f8600" : "#cf1322",
            }}
            prefix={asset.grow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            suffix="$"
          />
          <List
            size="small"
            style={statisticStyle}
            dataSource={[
              {
                title: "Total Profit",
                value: asset.totalProfit,
                withTag: true,
              },
              { title: "Asset Amout", value: asset.amount, isPlaine: true },
            ]}
            renderItem={(item) => (
              <List.Item
                style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{item.title}</span>
                <span>
                  {item.withTag && (
                    <Tag color={asset.grow ? "green" : "red"}>
                      {asset.growPercent}%
                    </Tag>
                  )}
                  {item.isPlaine && item.value}
                  {!item.isPlaine && (
                    <Typography.Text type={asset.grow ? "success" : "danger"}>
                      {item.value.toFixed(2)}$
                    </Typography.Text>
                  )}
                </span>
              </List.Item>
            )}
          />
        </Card>
      ))}
    </Layout.Sider>
  );
}
