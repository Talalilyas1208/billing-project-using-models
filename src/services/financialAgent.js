/**
 * Financial Analytics & Revenue Agent
 */
export const FinancialAgent = {
  /**
   * Calculates total revenue summary across all invoices
   */
  getRevenueSummary: (invoices = []) => {
    let totalRevenue = 0;
    let paidAmount = 0;
    let pendingAmount = 0;
    let overdueAmount = 0;

    invoices.forEach((inv) => {
      const amount = Number(inv.amount || inv.total || 0);
      totalRevenue += amount;

      const status = (inv.status || '').toLowerCase();
      if (status === 'paid' || status === 'approved') {
        paidAmount += amount;
      } else if (status === 'overdue') {
        overdueAmount += amount;
      } else {
        pendingAmount += amount;
      }
    });

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      paidAmount: Number(paidAmount.toFixed(2)),
      pendingAmount: Number(pendingAmount.toFixed(2)),
      overdueAmount: Number(overdueAmount.toFixed(2)),
      invoiceCount: invoices.length,
    };
  },
};

export default FinancialAgent;
