import { Layout, Card, Statistic, Typography, List, Spin } from "antd";
import { useState, useEffect } from "react";
import { fakeFetchCrypto, fetchAssets } from "../../api";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { persentDifference } from "../../util";

const siderStyle = {
  padding: "1rem",
};
const statisticStyle = {
  marginBottom: "1rem",
};

export default function AppSider() {
  const [loading, setLoading] = useState(false);
  const [crypto, setCrypto] = useState([]);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    async function preload() {
      setLoading(true);
      const { result } = await fakeFetchCrypto();
      const assets = await fetchAssets();

      setAssets(
        assets.map((asset) => {
          const coin = result.find((c) => c.id === asset.id);
          return {
            grow: asset.price < coin.price,
            growPersent: persentDifference(asset.price, coin.price),
            totalAmount: asset.amount * coin.price,
            totalProfit: asset.amount * coin.price - asset.amount * asset.price,
            ...asset,
          };
        })
      );

      setCrypto(result);
      setLoading(false);
    }
    preload();
  }, []);

  if (loading) {
    return <Spin fullscreen />;
  }

  return (
    <Layout.Sider width="25%" style={siderStyle}>
      {assets.map((asset) => (
        <Card key={asset.id} style={statisticStyle}>
          <Statistic
            title={asset.id}
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
              { title: "Total Profit", value: asset.totalProfit },
              { title: "Asset Amout", value: asset.amount },
              { title: "Difference", value: asset.growPersent },
            ]}
            renderItem={(item) => (
              <List.Item>
                <span>{item.title}</span>
                <span>{item.value}</span>
              </List.Item>
            )}
          />
        </Card>
      ))}
    </Layout.Sider>
  );
}
