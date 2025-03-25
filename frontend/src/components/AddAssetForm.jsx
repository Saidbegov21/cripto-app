import {
  Select,
  Space,
  Divider,
  Form,
  InputNumber,
  Button,
  DatePicker,
  Result,
} from "antd";
import { useState, useRef } from "react";
import { useCrypto } from "../context/crypto-context";
import CoinInfo from "./CoinInfo";

const validateMesseges = {
  required: "${label} is required",
  types: { number: "${label} is not valid number" },
  number: {
    range: "${label} must be between %{min} and ${max}",
  },
};

export default function AddAssetForm({ onClose }) {
  const [form] = Form.useForm();
  const { crypto, addAsset } = useCrypto();
  const [submitted, setSubmitted] = useState(false);
  const [coin, setCoin] = useState(null);
  const assetRef = useRef();

  if (submitted) {
    return (
      <Result
        status="success"
        title="New Asset!"
        subTitle={`Addet ${assetRef.current.amount} of ${coin.name} by peice ${assetRef.current.price}`}
        extra={[
          <Button type="primary" key="console" onClick={onClose}>
            Go Console
          </Button>,
        ]}
      />
    );
  }

  if (!coin) {
    return (
      <Select
        style={{ width: "100%" }}
        onSelect={(v) => setCoin(crypto.find((c) => c.id === v))}
        placeholder="Select Coin"
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
    );
  }

  function onFinish(value) {
    const newAsset = {
      id: coin.id,
      amount: value.amount,
      price: value.price,
      date: value.date?.$d ?? new Date(),
    };
    assetRef.current = newAsset;
    setSubmitted(true);
    addAsset(newAsset);
  }

  function handelAmountChange(value) {
    const price = form.getFieldValue("price");
    form.setFieldsValue({
      total: +(value * price).toFixed(2),
    });
  }

  function handelPriceChange(value) {
    const amount = form.getFieldValue("amount");
    form.setFieldsValue({
      total: +(amount * value).toFixed(2),
    });
  }

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 10,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        price: coin.price.toFixed(2),
      }}
      onFinish={onFinish}
      validatemesseges={validateMesseges}
    >
      <CoinInfo coin={coin} />
      <Divider />
      <Form.Item
        label="Amount"
        name="amount"
        rules={[
          {
            required: true,
            type: "number",
            min: 0,
          },
        ]}
      >
        <InputNumber
          placeholder="Enter coin amount"
          onChange={handelAmountChange}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item label="Price" name="price">
        <InputNumber
          disabled
          onChange={handelPriceChange}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item label="Date & Time" name="data">
        <DatePicker showTime />
      </Form.Item>

      <Form.Item label="Total" name="total">
        <InputNumber disabled style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Asset
        </Button>
      </Form.Item>
    </Form>
  );
}
