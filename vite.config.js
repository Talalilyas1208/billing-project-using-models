import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';

// Complete dataset definitions matching the user's mock server schema
const Result = [
  {
    productname: "12",
    description: "12",
    revenueCategory: "monthyly-recurring",
    vat: "Normal sale of goods",
    price: 12,
    currency: "USD",
    productNumber: "12",
    supplier: "12",
    id: "672be90a-8e2d-4bc8-81d7-44d2eb2da7d4",
  },
  {
    productname: "12",
    description: "12",
    revenueCategory: "monthyly-recurring",
    vat: "Normal sale of goods",
    price: 12,
    currency: "USD",
    productNumber: "12",
    supplier: "12",
    id: "672be90a-8e2d-4bc8-81d7-44d2eb2da7d6",
  },
  {
    productname: "12",
    description: "12",
    revenueCategory: "monthyly-recurring",
    vat: "Normal sale of goods",
    price: 12,
    currency: "USD",
    productNumber: "12",
    supplier: "12",
    id: "672be90a-8e2d-4bc8-81d7-44d2eb2da7d3",
  },
];

const mockdata = [
  { id: 1, date: "10/24/2022" },
  { id: 2, date: "5/30/2022" },
  { id: 3, date: "10/24/2022" },
  { id: 4, date: "10/24/2022" },
  { id: 5, date: "10/24/2022" },
  { id: 6, date: "10/24/2022" },
  { id: 7, date: "5/25/2023" },
];

const customer = [
  { id: "cust-1", name: "Acme Corporation", email: "billing@acme.com", country: "United States", status: "Active" },
  { id: "cust-2", name: "Nordic Tech Solutions AB", email: "accounts@nordictech.se", country: "Sweden", status: "Active" },
  { id: "cust-3", name: "Copenhagen Design House", email: "finance@cphdesign.dk", country: "Denmark", status: "Active" },
];

const newdata = [
  { transaction_id: 1, transaction_date: "11/23/2022", transaction_amount: 7877.88 },
  { transaction_id: 2, transaction_date: "3/4/2022", transaction_amount: 7868.78 },
  { transaction_id: 3, transaction_date: "1/2/2022", transaction_amount: 1070.15 },
];

const labelforfield = [
  { key: 1, label: "Contact Number", type: "number", options: [] },
  {
    key: 2,
    label: "Payment terms",
    type: "select",
    options: [
      { value: "net15", label: "Net 15" },
      { value: "net30", label: "Net 30" },
      { value: "net60", label: "Net 60" },
      { value: "net90", label: "Net 90" },
      { value: "dueOnReceipt", label: "Due on receipt" },
    ],
  },
  { key: 3, label: "Currency", type: "currency", options: [] },
  {
    key: 4,
    label: "Language",
    type: "select",
    options: [
      { value: "en", label: "English" },
      { value: "da", label: "Danish" },
      { value: "de", label: "German" },
      { value: "fr", label: "French" },
    ],
  },
  {
    key: 5,
    label: "Email delivery",
    type: "select",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  },
];

const Language = [
  { country_name: "Greece" },
  { country_name: "Canada" },
  { country_name: "Egypt" },
  { country_name: "Denmark" },
  { country_name: "United States" },
  { country_name: "Pakistan" },
];

const approvebutton = [
  { id: 1, label: "As an e invoice" },
  { id: 2, label: "By email " },
  { id: 3, label: "Approve" },
];

const sidebar = [
  {
    id: 1,
    label: "Invoicing",
    path: "/dashboard",
    children: [
      { name: "Invoice", link: "/dashboard/invoices" },
      { name: "Products", link: "/dashboard/products" },
      { name: "Offers", link: "/dashboard/offers" },
      { name: "contact", link: "/dashboard/contact" },
      { name: "Customer", link: "/dashboard/Customer" },
    ],
  },
];

const invoice = [
  {
    id: "1",
    company_name: "talalilyas",
    first_name: "talalilyas",
  },
];

const currency = [
  { id: "1", code: "PKR", name: "Pakistani Rupee", symbol: "₨", country: "Pakistan" },
  { id: "2", code: "USD", name: "United States Dollar", symbol: "$", country: "United States" },
  { id: "3", code: "DKK", name: "Danish Krone", symbol: "kr", country: "Denmark" },
  { id: "4", code: "EUR", name: "Euro", symbol: "€", country: "European Union" },
  { id: "5", code: "GBP", symbol: "British Pound Sterling", symbol: "£", country: "United Kingdom" },
];

const revnue = [
  { id: 1, key: "monthyly-recurring", code: "Monthly Recurring" },
  { id: 2, key: "one_time", code: "One-Time Fee" },
  { id: 3, key: "service", code: "Professional Services", title: "manager" },
  { id: 4, key: "subscription", code: "Annual Subscription" },
];

const vat = [
  { id: 1, key: "vat_free", code: "VAT - free", description: "Sales of non-VAT good" },
  { id: 2, key: "normal_goods", code: "Normal sale of goods", description: "Sale of taxable goods." },
  { id: 3, key: "normal_services", code: "Normal sale of services", description: "Sale of VAT-subject services.", title: "Services" },
];

const paymentdeadline = [
  { label: "Same day", days: 0 },
  { label: "2 days after", days: 2 },
  { label: "7 days after", days: 7 },
  { label: "14 days after", days: 14 },
];

const PRICEOPTIONS = [
  { label: "Ekskl. moms", value: "excl" },
  { label: "Inkl. moms", value: "incl" },
];

const DESIGNOPTIONS = [
  { label: "Standardskabelon", value: "standard" },
  { label: "Moderne skabelon", value: "modern" },
  { label: "Klassisk skabelon", value: "classic" },
];

const versions = { paymentdeadline: 1 };

// Global data store dictionary matching mock server
const globalData = {
  products: Result,
  sidebar: sidebar,
  invoice: invoice,
  currency: currency,
  revnue: revnue,
  vat: vat,
  mockdata: mockdata,
  newdata: newdata,
  customer: customer,
  labelforfield: labelforfield,
  Language: Language,
  paymentdeadline: paymentdeadline,
  priceModeOptions: PRICEOPTIONS,
  designOptions: DESIGNOPTIONS,
  approvebutton: approvebutton,
};

/**
 * Dynamic Vite Middleware Plugin matching http-mockserver handler logic
 */
const dynamicMockServerPlugin = () => ({
  name: 'dynamic-mock-server-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (!req.url.startsWith('/api/')) {
        return next();
      }

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

      if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        return res.end();
      }

      const rawPath = req.url.split('?')[0].replace(/^\/api\//, '');
      const parts = rawPath.split('/');
      const from = parts[0];
      const id = parts[1];

      // Parse query params
      const searchMatch = req.url.match(/search=([^&]*)/);
      const pageMatch = req.url.match(/page=([^&]*)/);
      const limitMatch = req.url.match(/limit=([^&]*)/);

      const searchText = searchMatch ? decodeURIComponent(searchMatch[1]).toLowerCase() : '';
      const page = pageMatch ? parseInt(pageMatch[1], 10) || 1 : 1;
      const limit = limitMatch ? parseInt(limitMatch[1], 10) || 16 : 16;

      const targetData = globalData[from];

      if (!targetData) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ message: "Not Found" }));
      }

      // GET Handler
      if (req.method === 'GET') {
        if (!Array.isArray(targetData)) {
          return res.end(JSON.stringify(targetData));
        }

        let fullList = [...targetData];
        if (searchText) {
          fullList = fullList.filter((item) =>
            Object.values(item).some((value) =>
              String(value).toLowerCase().includes(searchText)
            )
          );
        }

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedItems = fullList.slice(startIndex, endIndex);

        return res.end(
          JSON.stringify({
            data: paginatedItems,
            totalItems: fullList.length,
            totalPages: Math.ceil(fullList.length / limit) || 1,
            version: versions[from] || 1,
            currentPage: page,
          })
        );
      }

      // POST Handler
      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          const newData = body ? JSON.parse(body) : {};
          newData.id = crypto.randomUUID();
          newData.createdDate = new Date().toISOString();
          if (Array.isArray(globalData[from])) {
            globalData[from].push(newData);
          }
          res.statusCode = 201;
          return res.end(JSON.stringify({ message: `${from} Added Successfully`, data: newData }));
        });
        return;
      }

      // PUT Handler
      if (req.method === 'PUT') {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          const updatedData = body ? JSON.parse(body) : {};
          if (Array.isArray(globalData[from])) {
            const index = globalData[from].findIndex((item) => String(item.id) === String(id));
            if (index !== -1) {
              globalData[from][index] = { ...globalData[from][index], ...updatedData };
              res.statusCode = 200;
              return res.end(JSON.stringify({ message: `${from} Updated Successfully`, data: globalData[from][index] }));
            }
          }
          res.statusCode = 404;
          return res.end(JSON.stringify({ message: "Item Not Found" }));
        });
        return;
      }

      // DELETE Handler
      if (req.method === 'DELETE') {
        if (Array.isArray(globalData[from])) {
          const index = globalData[from].findIndex((item) => String(item.id) === String(id));
          if (index !== -1) {
            const [deletedItem] = globalData[from].splice(index, 1);
            res.statusCode = 200;
            return res.end(JSON.stringify({ message: `${from} Deleted Successfully`, data: deletedItem }));
          }
        }
        res.statusCode = 404;
        return res.end(JSON.stringify({ message: "Item Not Found" }));
      }
    });
  },
});

export default defineConfig({
  plugins: [react(), dynamicMockServerPlugin()],
});
