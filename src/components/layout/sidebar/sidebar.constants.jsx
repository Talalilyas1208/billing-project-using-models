import {
  AppstoreOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  PhoneOutlined,
  TeamOutlined,
} from '@ant-design/icons';

export const defaultNavItems = [
  { key: '/dashboard/invoices', label: 'Invoices', icon: <FileTextOutlined /> },
  { key: '/dashboard/products', label: 'Products', icon: <AppstoreOutlined /> },
  { key: '/dashboard/offers', label: 'Offers', icon: <FileDoneOutlined /> },
  { key: '/dashboard/contact', label: 'Contact', icon: <PhoneOutlined /> },
  { key: '/dashboard/customer', label: 'Customers', icon: <TeamOutlined /> },
];

export const iconMap = {
  Invoice: <FileTextOutlined />,
  Invoices: <FileTextOutlined />,
  invoices: <FileTextOutlined />,
  Products: <AppstoreOutlined />,
  products: <AppstoreOutlined />,
  Offers: <FileDoneOutlined />,
  offers: <FileDoneOutlined />,
  Contact: <PhoneOutlined />,
  contact: <PhoneOutlined />,
  Customer: <TeamOutlined />,
  Customers: <TeamOutlined />,
  customer: <TeamOutlined />,
};