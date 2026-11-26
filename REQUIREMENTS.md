# Shared requirements — Practice 13

User story. As a student, I want to choose a future start time and duration so that I can see whether Atlas 204 is available.

| ID | Shared acceptance criterion |
|---|---|
| AC1 | Start strictly after the fixed 09:00 classroom clock. |
| AC2 | Duration is greater than zero and at most 120 minutes. Use the baseline's whole-minute representation. |
| AC3 | Positive overlap with either existing booking is unavailable. |
| AC4 | A blocked room is unavailable. |
| AC5 | Display the Boolean decision, reason code and visible message without changing bookings. |
| AC6 | Reject invalid input with understandable feedback. |

Inputs are `start` (HH:MM), `duration` (whole minutes), `blocked` (Boolean) and fictional booking data. The existing bookings are 10:00–11:00 and 14:30–15:30. An interval must finish by 24:00. Half-open intervals permit endpoint adjacency.

Output fields are `available`, a reason code and a visible message. Validation takes priority, followed by the blocked flag, followed by overlap checking. Both implementations use exactly these inputs and rules.

| Test | Start | Minutes | Blocked | Expected |
|---|---|---:|---|---|
| T1 | 12:00 | 45 | false | AVAILABLE |
| T2 | 10:30 | 45 | false | OVERLAP |
| T3 | 12:00 | 45 | true | BLOCKED |
| T4 | 12:00 | 0 | false | INVALID_INTERVAL |
| T5 | 12:00 | 121 | false | TOO_LONG |
| T6 | 08:45 | 30 | false | NOT_FUTURE |
| T7 | 11:00 | 30 | false | AVAILABLE |
| T8 | Repeat T1–T7 | — | — | Both bookings retain their values and order |

See `dist/app/cases.json` for machine-readable test inputs and `dist/evidence/observed.json` for actual outcomes from both engines. The browser's **Test results** tab reruns the cases with the real Form.io renderer and JavaScript checker. T8 uses one continuing form instance.
