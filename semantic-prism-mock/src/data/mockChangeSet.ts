export const proposalFields = {
  targetRule: "CreditLimitValidation",
  businessChange: "Allow exception for customer category VIP",
  requiredApproval: "SalesManager",
  validationMessage: "Credit limit exceeded. Sales Manager approval required.",
  riskLevel: "Medium"
};

export const changeSetMeta = {
  id: "CS-1042",
  label: "CS-1042 VIP Credit Exception",
  owner: "Semantic Prism Mock",
  provenance: "Deterministically derived + AI explained"
};

export const changeBasketItems = [
  "Modify CreditLimitValidation",
  "Add VIPExceptionPolicy",
  "Require SalesManager approval",
  "Add VIPExceptionValidationTest"
];
