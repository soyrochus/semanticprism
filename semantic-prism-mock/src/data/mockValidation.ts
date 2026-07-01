export const availableChecks = [
  "Semantic consistency",
  "Source patch structure",
  "Referenced role mapping",
  "Validation test coverage"
];

export const passedChecklist = [
  "Semantic consistency passed",
  "Source patch structure passed",
  "Referenced role mapping passed with warning",
  "Validation test coverage passed"
];

export const validationWarning =
  "Approval.role mapping requires platform expert confirmation before merge.";

export const validationSummary =
  "The proposed VIP exception is structurally consistent and traceable to the original ConfirmOrder artefact. One governance warning remains for the platform-specific Approval.role mapping.";
