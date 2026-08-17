import dayjs from 'dayjs';

/**
 * Invoice Calculation & Automation Agent
 */
export const InvoiceAgent = {
  /**
   * Calculates subtotal, tax rate, tax amount, and total
   */
  calculateTotals: (items = [], vatType = 'normal_goods', currency = 'USD') => {
    let taxPercentage = 25; // Default 25% VAT

    if (vatType === 'vat_free' || vatType === '0') {
      taxPercentage = 0;
    } else if (vatType === 'normal_services') {
      taxPercentage = 25;
    }

    const subtotal = items.reduce((acc, item) => {
      const qty = Number(item.number || item.quantity || 0);
      const price = Number(item.unitPrice || item.price || 0);
      return acc + qty * price;
    }, 0);

    const taxTotal = (subtotal * taxPercentage) / 100;
    const grandTotal = subtotal + taxTotal;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      taxPercentage,
      taxTotal: Number(taxTotal.toFixed(2)),
      grandTotal: Number(grandTotal.toFixed(2)),
      currency,
    };
  },

  /**
   * Calculates payment due date from issue date and payment deadline days
   */
  calculateDueDate: (issueDate = new Date(), deadlineDays = 14) => {
    const daysToAdd = Number(deadlineDays) || 0;
    return dayjs(issueDate).add(daysToAdd, 'day').format('YYYY-MM-DD');
  },

  /**
   * Auto-validates invoice payload before submission
   */
  validateInvoice: (invoiceData) => {
    const errors = [];
    if (!invoiceData.customerId) errors.push('Customer must be selected.');
    if (!invoiceData.items || invoiceData.items.length === 0) errors.push('At least one line item is required.');

    const invalidItems = (invoiceData.items || []).filter(
      (item) => !item.product && !item.description
    );
    if (invalidItems.length > 0) errors.push('All line items must have a product or description.');

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

export default InvoiceAgent;
