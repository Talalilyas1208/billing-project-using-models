/**
 * Customer Risk & Blacklist Guard Agent
 */
export const CustomerGuardAgent = {
  /**
   * Assesses customer risk level based on overdue invoices and balance history
   */
  assessRisk: (customer, invoices = []) => {
    const customerInvoices = invoices.filter(
      (inv) => inv.customerId === customer.id || inv.client === customer.Company_name
    );

    const overdueCount = customerInvoices.filter(
      (inv) => inv.status === 'Overdue' || inv.status === 'Unpaid'
    ).length;

    let riskLevel = 'Low';
    let recommendation = 'Standard 14 or 30 days payment deadline.';
    let isBlacklistCandidate = false;

    if (overdueCount >= 3) {
      riskLevel = 'High';
      recommendation = 'Require immediate payment (Same day) or request upfront deposit.';
      isBlacklistCandidate = true;
    } else if (overdueCount === 1 || overdueCount === 2) {
      riskLevel = 'Medium';
      recommendation = 'Limit payment terms to 7 days.';
    }

    return {
      customerId: customer.id,
      customerName: customer.Company_name || customer.name,
      overdueCount,
      riskLevel,
      recommendation,
      isBlacklistCandidate,
    };
  },

  /**
   * Filters out blacklisted customers from standard marketing offers
   */
  filterEligibleCustomers: (customers = [], blacklistedIds = []) => {
    return customers.filter((c) => !blacklistedIds.includes(c.id));
  },
};

export default CustomerGuardAgent;
