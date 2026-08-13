import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Input, InputNumber, Card, List, Typography, Space, message } from 'antd';
import { PlusOutlined, DeleteOutlined, ClearOutlined } from '@ant-design/icons';
import { addItem, removeItem, clearItems } from './store/slices/billingSlice';
import useLocalStorage from './hooks/useLocalStorage';

const { Title, Text } = Typography;

function App() {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.billing);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // useLocalStorage demo — persists the user's name across sessions
  const [userName, setUserName] = useLocalStorage('userName', '');

  const handleAddItem = () => {
    if (!name) {
      message.warning('Please enter an item name');
      return;
    }
    dispatch(
      addItem({
        id: Date.now(),
        name,
        price,
        quantity,
      })
    );
    setName('');
    setPrice(0);
    setQuantity(1);
    message.success('Item added!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Title level={2} className="text-center mb-8">
          Billing Project
        </Title>

        {/* useLocalStorage Demo */}
        <Card className="mb-6" size="small">
          <Text type="secondary">useLocalStorage demo — your name persists across refreshes:</Text>
          <Input
            className="mt-2"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          {userName && (
            <Text className="mt-2 block">
              Welcome back, <Text strong>{userName}</Text>!
            </Text>
          )}
        </Card>

        {/* Add Item Form */}
        <Card title="Add Item" className="mb-6">
          <Space direction="vertical" className="w-full" size="middle">
            <Input
              placeholder="Item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Space>
              <InputNumber
                min={0}
                placeholder="Price"
                value={price}
                onChange={(val) => setPrice(val || 0)}
                prefix="$"
              />
              <InputNumber
                min={1}
                placeholder="Qty"
                value={quantity}
                onChange={(val) => setQuantity(val || 1)}
              />
            </Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddItem} block>
              Add Item
            </Button>
          </Space>
        </Card>

        {/* Items List */}
        <Card
          title="Billing Items"
          extra={
            <Button
              danger
              icon={<ClearOutlined />}
              onClick={() => dispatch(clearItems())}
              disabled={items.length === 0}
              size="small"
            >
              Clear All
            </Button>
          }
        >
          <List
            dataSource={items}
            locale={{ emptyText: 'No items added yet' }}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="delete"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => dispatch(removeItem(item.id))}
                  />,
                ]}
              >
                <List.Item.Meta
                  title={item.name}
                  description={`$${item.price.toFixed(2)} × ${item.quantity}`}
                />
                <Text strong>${(item.price * item.quantity).toFixed(2)}</Text>
              </List.Item>
            )}
          />
          <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
            <Title level={4} className="m-0">
              Total: ${totalAmount.toFixed(2)}
            </Title>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default App;
