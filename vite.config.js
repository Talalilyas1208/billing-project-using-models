import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';

// Dynamic mock datasets matching http-mockserver specifications
const Result = [
  {
    productname: "Software Architecture Consulting",
    description: "Monthly enterprise software architecture consulting",
    revenueCategory: "monthyly-recurring",
    vat: "Normal sale of goods",
    price: 1800,
    currency: "USD",
    productNumber: "PRD-101",
    supplier: "Billy.dk",
    id: "672be90a-8e2d-4bc8-81d7-44d2eb2da7d4",
  },
  {
    productname: "Cloud Hosting & DevOps Maintenance",
    description: "Infrastructure support and SLA monitoring",
    revenueCategory: "monthyly-recurring",
    vat: "Normal sale of services",
    price: 950,
    currency: "USD",
    productNumber: "PRD-102",
    supplier: "Billy.dk",
    id: "672be90a-8e2d-4bc8-81d7-44d2eb2da7d6",
  },
];

const sidebar = [
  { key: "invoices", label: "Invoices", path: "/dashboard/invoices" },
  { key: "products", label: "Products", path: "/dashboard/products" },
  { key: "offers", label: "Offers", path: "/dashboard/offers" },
  { key: "customers", label: "Customers", path: "/dashboard/Customer" },
];

const invoice = [
  {
    id: "INV-2026-001",
    invoiceNumber: "1001",
    client: "Acme Corporation",
    amount: 2250.00,
    status: "Approved",
    date: "2026-08-10",
    dueDate: "2026-08-24",
    currency: "USD",
  },
];

const currency = [
  { code: "PKR", name: "Pakistani Rupee", symbol: "Rs" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
];

const revnue = [
  { key: "monthly", label: "Monthly Recurring Revenue", code: "MRR" },
  { key: "one_time", label: "One-Time Sale", code: "OTS" },
  { key: "services", label: "Professional Services", code: "PS" },
];

const mockdata = [
  { id: 1, date: "10/24/2022" },
  { id: 2, date: "5/30/2022" },
  { id: 3, date: "10/24/2022" },
];

// Empty initial customer array so UI starts completely dynamic
const customer = [];

const newdata = [
  { transaction_id: 1, transaction_date: "11/23/2022", transaction_amount: 7877.88 },
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
      { value: "dueOnReceipt", label: "Due on receipt" },
    ],
  },
  { key: 3, label: "Currency", type: "currency", options: [] },
];

const Language = [
  { code: "en", name: "English" },
  { code: "da", name: "Danish" },
];

const approvebutton = [
  { id: 1, label: "Save as Draft", action: "draft" },
  { id: 2, label: "Send for Review", action: "review" },
  { id: 3, label: "Approve & Save", action: "approve" },
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

      const urlObj = new URL(req.url, 'http://localhost');
      const pathname = urlObj.pathname.replace(/^\/api\//, '');
      const parts = pathname.split('/');
      const from = parts[0];
      const idParam = parts[1];

      const searchText = urlObj.searchParams.get('search')?.toLowerCase() || '';
      const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
      const limit = parseInt(urlObj.searchParams.get('limit') || '10', 10);

      const targetData = globalData[from];
      if (!targetData) {
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: `Route /api/${from} Not Found` }));
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

          // Normalize customer fields
          if (!newData.Company_name && newData.name) {
            newData.Company_name = newData.name;
          }
          if (!newData.name && newData.Company_name) {
            newData.name = newData.Company_name;
          }

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
          const updatedFields = body ? JSON.parse(body) : {};
          if (Array.isArray(globalData[from])) {
            const index = globalData[from].findIndex((item) => String(item.id) === String(idParam));
            if (index !== -1) {
              globalData[from][index] = { ...globalData[from][index], ...updatedFields };
              if (!globalData[from][index].Company_name && globalData[from][index].name) {
                globalData[from][index].Company_name = globalData[from][index].name;
              }
              res.statusCode = 200;
              return res.end(JSON.stringify({ message: `${from} Updated Successfully`, data: globalData[from][index] }));
            }
          }
          res.statusCode = 404;
          return res.end(JSON.stringify({ error: `Item ${idParam} not found in ${from}` }));
        });
        return;
      }

      // DELETE Handler
      if (req.method === 'DELETE') {
        if (Array.isArray(globalData[from])) {
          const index = globalData[from].findIndex((item) => String(item.id) === String(idParam));
          if (index !== -1) {
            const deleted = globalData[from].splice(index, 1);
            res.statusCode = 200;
            return res.end(JSON.stringify({ message: `${from} Deleted Successfully`, data: deleted[0] }));
          }
        }
        res.statusCode = 404;
        return res.end(JSON.stringify({ error: `Item ${idParam} not found in ${from}` }));
      }

      next();
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), dynamicMockServerPlugin()],
});
