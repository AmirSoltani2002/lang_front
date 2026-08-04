export const STAGE_LABELS: Record<string, string> = {
  "1_day": "1-day review",
  "7_days": "7-day review",
  "1_month": "1-month review",
  "3_months": "3-month review",
  "6_months": "6-month review",
  "1_year": "1-year review",
};

export function stageLabel(stage: string): string {
  return STAGE_LABELS[stage] ?? stage.replaceAll("_", " ");
}

export function formatDueDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
