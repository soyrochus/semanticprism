export const semanticDslText = `rule CreditLimitValidation
  applies_to OrderConfirmation.ConfirmOrder
  reads Order.total, Customer.creditLimit, Customer.category

  when Order.total > Customer.creditLimit
   and Customer.category != "VIP"
  then block_order
   with message "Credit limit exceeded."

  when Order.total > Customer.creditLimit
   and Customer.category == "VIP"
  then require_approval SalesManager
   with message "Credit limit exceeded. Sales Manager approval required."`;

export const originalSourceText = `FUNCTION ConfirmOrder
  READ Customer BY #CUSTOMER_ID
  READ Order BY #ORDER_ID

  IF (#ORDER_TOTAL > #CREDIT_LIMIT)
    SET #STATUS = "BLOCKED"
    DISPLAY "Credit limit exceeded."
    RETURN
  ENDIF

  SET #STATUS = "CONFIRMED"
  ENQUEUE NotificationQueue WITH #ORDER_ID
END`;

export const generatedDiffText = `--- legacy/ConfirmOrder.rdmx
+++ legacy/ConfirmOrder.rdmx
@@ Credit limit validation
-  IF (#ORDER_TOTAL > #CREDIT_LIMIT)
-    SET #STATUS = "BLOCKED"
-    DISPLAY "Credit limit exceeded."
-    RETURN
-  ENDIF
+  IF (#ORDER_TOTAL > #CREDIT_LIMIT)
+    IF (#CUSTOMER_CATEGORY = "VIP" AND #APPROVAL_ROLE = "SalesManager")
+      SET #APPROVAL_STATUS = "REQUIRED"
+      DISPLAY "Credit limit exceeded. Sales Manager approval required."
+    ELSE
+      SET #STATUS = "BLOCKED"
+      DISPLAY "Credit limit exceeded."
+      RETURN
+    ENDIF
+  ENDIF`;

export const noDiffText = `No generated diff yet.

Create the semantic change or generate change set CS-1042 to preview the deterministic patch.`;

export const traceText = `Trace: CreditLimitValidation

Derivation sources
- Original Artefact ConfirmOrder
- UI Event OrderConfirmation.OK
- Field Customer.creditLimit
- Field Order.total
- Entity Customer
- Entity Order

Projections
- Semantic DSL block: rule CreditLimitValidation
- Impact graph node: CreditLimitValidation
- Change-set item: Modify CreditLimitValidation

Evidence types
- Deterministic extraction
- AI explanation
- Human review pending`;

export function getContextHeading(selectedObject: string) {
  if (selectedObject === "Customer.creditLimit") {
    return "Field context: Customer.creditLimit";
  }
  if (selectedObject === "CS-1042 VIP Credit Exception") {
    return "Change-set context: CS-1042 VIP Credit Exception";
  }
  return `Selected context: ${selectedObject}`;
}
