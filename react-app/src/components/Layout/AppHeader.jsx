import { Layout, Select, Space, Button } from "antd";
import { useCrypto } from "../../context/crypto-context";
import { useEffect, useState } from "react";

const headerStyle = {
  width: "100%",
  textAlign: "center",
  height: 60,
  paddign: "1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export default function AppHeader() {
  const [select, setSelect] = useState(false);
  const [modal, setModal] = useState(false);
  const { crypto } = useCrypto();

  useEffect(() => {
    const keypress = (event) => {
      if (event.key === "/") {
        setSelect((prew) => !prew);
      }
    };
    document.addEventListener("keypress", keypress);
    return () => document.removeEventListener("keypress", keypress);
  }, []);

  function handlSelect(value) {
    console.log(value);
  }

  return (
    <Layout.Header style={headerStyle}>
      <Select
        style={{
          width: 250,
        }}
        open={select}
        onSelect={handlSelect}
        onClick={() => setSelect((prew) => !prew)}
        value="plase / to open"
        options={crypto.map((coin) => ({
          label: coin.name,
          value: coin.id,
          icon: coin.icon,
        }))}
        optionRender={(option) => (
          <Space>
            <img
              style={{ width: 20 }}
              src={option.data.icon}
              alt={option.data.label}
            />
            {option.data.label}
          </Space>
        )}
      />
      <Button type="primary">Add Asset</Button>
    </Layout.Header>
  );
}
