export interface ExplorerGroup {
  title: string;
  items: string[];
}

export const explorerTree: ExplorerGroup[] = [
  {
    title: "Application",
    items: ["Order Entry", "Customer Management", "Approval Management"]
  },
  {
    title: "Screens",
    items: ["OrderConfirmation", "CustomerProfile", "ApprovalQueue"]
  },
  {
    title: "Business Rules",
    items: ["CreditLimitValidation", "VIPExceptionPolicy", "ApprovalRequiredRule", "OrderConfirmationRule"]
  },
  {
    title: "Entities",
    items: ["Customer", "Order", "Approval", "CustomerCategory"]
  },
  {
    title: "Fields",
    items: ["Customer.creditLimit", "Customer.category", "Order.total", "Approval.role", "Approval.status"]
  },
  {
    title: "Data Stores",
    items: ["CUSTOMER table", "ORDER_HEADER table", "APPROVAL table"]
  },
  {
    title: "Integrations",
    items: ["Pricing Service", "CRM Customer Profile", "Notification Queue"]
  },
  {
    title: "Validation",
    items: ["OrderCreditValidationTest", "VIPExceptionValidationTest"]
  },
  {
    title: "Change Sets",
    items: ["CS-1042 VIP Credit Exception"]
  }
];
