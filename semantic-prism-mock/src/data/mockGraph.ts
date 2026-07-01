export type NodeType =
  | "screen"
  | "process"
  | "business-rule"
  | "field"
  | "entity"
  | "table"
  | "integration"
  | "role"
  | "policy"
  | "source-artifact"
  | "validation"
  | "change-set"
  | "ai-inference";

export type EdgeType =
  | "triggers"
  | "validates"
  | "reads"
  | "writes"
  | "depends-on"
  | "implemented-by"
  | "projected-as"
  | "impacts"
  | "requires-approval"
  | "validated-by"
  | "notifies"
  | "proposes";

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  status?: string;
  risk?: "low" | "medium" | "high";
  confidence?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: EdgeType;
}

export const graphNodes: GraphNode[] = [
  { id: "OrderConfirmation", label: "OrderConfirmation", type: "screen", confidence: "UI" },
  { id: "OK Button Handler", label: "OK Button Handler", type: "process" },
  { id: "ConfirmOrder", label: "ConfirmOrder", type: "process", status: "legacy" },
  { id: "CreditLimitValidation", label: "CreditLimitValidation", type: "business-rule", risk: "medium", confidence: "96%" },
  { id: "VIPExceptionPolicy", label: "VIPExceptionPolicy", type: "policy", risk: "medium", status: "proposed" },
  { id: "ApprovalRequiredRule", label: "ApprovalRequiredRule", type: "business-rule", status: "proposed" },
  { id: "Customer.creditLimit", label: "Customer.creditLimit", type: "field" },
  { id: "Customer.category", label: "Customer.category", type: "field" },
  { id: "Order.total", label: "Order.total", type: "field" },
  { id: "Approval.role", label: "Approval.role", type: "field", risk: "medium" },
  { id: "Approval.status", label: "Approval.status", type: "field" },
  { id: "Customer", label: "Customer", type: "entity" },
  { id: "Order", label: "Order", type: "entity" },
  { id: "Approval", label: "Approval", type: "entity" },
  { id: "CUSTOMER table", label: "CUSTOMER table", type: "table" },
  { id: "ORDER_HEADER table", label: "ORDER_HEADER table", type: "table" },
  { id: "APPROVAL table", label: "APPROVAL table", type: "table" },
  { id: "Pricing Service", label: "Pricing Service", type: "integration" },
  { id: "CRM Customer Profile", label: "CRM Customer Profile", type: "integration" },
  { id: "Notification Queue", label: "Notification Queue", type: "integration" },
  { id: "SalesManager", label: "SalesManager", type: "role" },
  { id: "OrderCreditValidationTest", label: "OrderCreditValidationTest", type: "validation", status: "passed" },
  { id: "VIPExceptionValidationTest", label: "VIPExceptionValidationTest", type: "validation", status: "new" },
  { id: "Original RDMLX Artefact", label: "Original RDMLX Artefact", type: "source-artifact", confidence: "source" },
  { id: "Semantic DSL Projection", label: "Semantic DSL Projection", type: "ai-inference", confidence: "AI+det" },
  { id: "CS-1042 VIP Credit Exception", label: "Generated Change Set CS-1042", type: "change-set", status: "draft" }
];

export const graphEdges: GraphEdge[] = [
  { source: "OrderConfirmation", target: "OK Button Handler", type: "triggers" },
  { source: "OK Button Handler", target: "ConfirmOrder", type: "triggers" },
  { source: "ConfirmOrder", target: "CreditLimitValidation", type: "validates" },
  { source: "CreditLimitValidation", target: "Order.total", type: "reads" },
  { source: "CreditLimitValidation", target: "Customer.creditLimit", type: "reads" },
  { source: "CreditLimitValidation", target: "Customer.category", type: "reads" },
  { source: "VIPExceptionPolicy", target: "CreditLimitValidation", type: "impacts" },
  { source: "ApprovalRequiredRule", target: "VIPExceptionPolicy", type: "depends-on" },
  { source: "VIPExceptionPolicy", target: "SalesManager", type: "requires-approval" },
  { source: "VIPExceptionPolicy", target: "Approval.role", type: "reads" },
  { source: "VIPExceptionPolicy", target: "VIPExceptionValidationTest", type: "validated-by" },
  { source: "CreditLimitValidation", target: "OrderCreditValidationTest", type: "validated-by" },
  { source: "Customer.creditLimit", target: "Customer", type: "depends-on" },
  { source: "Customer.category", target: "Customer", type: "depends-on" },
  { source: "Order.total", target: "Order", type: "depends-on" },
  { source: "Approval.role", target: "Approval", type: "depends-on" },
  { source: "Approval.status", target: "Approval", type: "depends-on" },
  { source: "Customer", target: "CUSTOMER table", type: "implemented-by" },
  { source: "Order", target: "ORDER_HEADER table", type: "implemented-by" },
  { source: "Approval", target: "APPROVAL table", type: "implemented-by" },
  { source: "ConfirmOrder", target: "ORDER_HEADER table", type: "writes" },
  { source: "ConfirmOrder", target: "Pricing Service", type: "depends-on" },
  { source: "Customer", target: "CRM Customer Profile", type: "projected-as" },
  { source: "ConfirmOrder", target: "Notification Queue", type: "notifies" },
  { source: "Original RDMLX Artefact", target: "ConfirmOrder", type: "implemented-by" },
  { source: "Original RDMLX Artefact", target: "Semantic DSL Projection", type: "projected-as" },
  { source: "Semantic DSL Projection", target: "CreditLimitValidation", type: "projected-as" },
  { source: "CS-1042 VIP Credit Exception", target: "VIPExceptionPolicy", type: "proposes" },
  { source: "CS-1042 VIP Credit Exception", target: "ApprovalRequiredRule", type: "proposes" },
  { source: "CS-1042 VIP Credit Exception", target: "VIPExceptionValidationTest", type: "proposes" },
  { source: "CS-1042 VIP Credit Exception", target: "CreditLimitValidation", type: "impacts" }
];

export const customerCreditLimitHighlight = [
  "Customer.creditLimit",
  "Customer",
  "CUSTOMER table",
  "CreditLimitValidation",
  "OrderConfirmation",
  "ConfirmOrder",
  "OrderCreditValidationTest",
  "CS-1042 VIP Credit Exception"
];

export const creditLimitValidationHighlight = [
  "CreditLimitValidation",
  "Order.total",
  "Customer.creditLimit",
  "Customer.category",
  "VIPExceptionPolicy",
  "ApprovalRequiredRule",
  "OrderConfirmation",
  "Original RDMLX Artefact",
  "Semantic DSL Projection",
  "CS-1042 VIP Credit Exception"
];

export const previewImpactHighlight = [
  "VIPExceptionPolicy",
  "SalesManager",
  "Approval.role",
  "VIPExceptionValidationTest",
  "CS-1042 VIP Credit Exception"
];

export const graphModeHighlights = {
  impact: ["CreditLimitValidation", "VIPExceptionPolicy", "CS-1042 VIP Credit Exception"],
  data: ["Customer", "Order", "Approval", "CUSTOMER table", "ORDER_HEADER table", "APPROVAL table"],
  flow: ["OrderConfirmation", "OK Button Handler", "ConfirmOrder", "Notification Queue"]
} satisfies Record<string, string[]>;

export const nodeTypeLabels: Record<NodeType, string> = {
  screen: "Screen",
  process: "Process",
  "business-rule": "Business rule",
  field: "Field",
  entity: "Entity",
  table: "Table",
  integration: "Integration",
  role: "Role",
  policy: "Policy",
  "source-artifact": "Source artefact",
  validation: "Validation",
  "change-set": "Change set",
  "ai-inference": "AI inference"
};
