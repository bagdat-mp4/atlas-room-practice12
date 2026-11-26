# Smart Campus — Practice 13

[Published Bolt demo](https://smart-campus-room-av-k08l.bolt.host/practice13.html) · [Bolt project](https://bolt.new/~/sb1-rc7hzhwx)

This repository contains the actual application files, locally bundled dependencies, baseline, tests, editable Form.io project, screenshots and PDF report for the supplied code-based / low-code comparison assignment. The handout uses Practice 12 in its lesson headings and Practice 13 in its submission instructions.

## Run from a fresh clone

Use Node.js 20 or later.

```sh
git clone https://github.com/bagdat-mp4/atlas-room-practice12.git
cd atlas-room-practice12
npm test
npm start
```

Open http://127.0.0.1:8000. All browser dependencies are included under `dist/vendor`, so running the checked-in application does not require npm install. `package-lock.json` pins the corresponding npm dependency tree for review and updates. Use `npm ci --ignore-scripts` when you need that tree locally.

Open **Test results → Run both suites**. This runs the shared eight cases against the actual JavaScript and Form.io engines. Both return 8/8. `npm test` runs 26 checks, comprising the original 19 code tests and 7 focused native-input configuration/parser regression checks. The real Form.io renderer is verified separately in the browser.

## Deliverables

- [Final PDF report](reports/Practice13_Amantay_Bagdat.pdf) includes requirements, the exact expected and observed results, comparison, security review, AI reflection and screenshots.
- [Code rule engine](dist/app/booking-rules.js), [input adapter](dist/app/checker.js) and [UI](dist/app/ui.js) are separate files.
- [Editable low-code project](dist/app/atlas-form.json) is a native Form.io JSON export. Open the live app's **Source → Visual form designer** to inspect or edit a local copy. Export changes to retain them.
- [Shared test inputs](dist/app/cases.json) and [code tests](tests/contract.cjs) are checked in.
- [Observed results](dist/evidence/observed.json), [UI checks](dist/evidence/ui-run.json), [Node output](dist/evidence/contract-tests.txt) and [timing records](dist/evidence/preparation-timing.json) preserve verification evidence.
- [Screenshots](dist/evidence) include the running versions, native builder, test results, 390-pixel layouts, and actual Bolt editor and hosting evidence.
- [Previous baseline](dist/baseline) preserves the recovered original application. The actual Bolt project also contains the pre-import checkpoint and execution logs.
- [Offline application export](dist/source.html) bundles both engines and the native visual editor into one portable HTML file.

## Contract

One fictional Atlas 204 room has bookings at 10:00–11:00 and 14:30–15:30. The demo clock is fixed at 09:00. Start strictly after that clock, use 1–120 whole minutes and finish by 24:00. A blocked room or a positive overlap is unavailable. Adjacent intervals are allowed. Return the availability Boolean, reason code and visible message. Checks do not write bookings.

## Provenance and limitations

ChatGPT assisted implementation and review. The completed page was imported, tested and published in the existing Bolt project. The native Form.io visual designer was used to edit and export the form. Nineteen Node tests passed inside Bolt, and both eight-case suites passed on Bolt Hosting. Final repository packaging and verification used GPT-6.1-Sol. Earlier model snapshots were not exposed in the recorded evidence.

Timing values describe initial automated and browser preparation intervals. They do not measure all manual engineering effort or establish a general development-speed advantage. The code debugging interval captures an automated patch operation only.

The recovered local baseline archive omitted an old checkpoint. That checkpoint was present in the actual Bolt workspace, where its baseline suite passed before import. Static classroom rules use trusted local configuration. A production reservation service would need trusted server-side checks and persistence.

## Dependencies and security

The bundled versions are Form.io 5.7.2 and Bootstrap 5.3.8. Their license notices and required font files are under `dist/vendor`. The submitted advisory lookup reported zero known advisories in 67 resolved dependencies on 26 November 2026. Review form expressions and rerun both suites when updating dependencies. Form.io calculated scripts require `unsafe-eval` in the demo CSP.

## Final validation repair

A review found that the numeric Form.io widget truncated `120.00001` to `120` before validation and accepted `1e2`, while JavaScript rejected both. The native form now preserves the duration as text and validates it through a small calculated numeric field. The independent JSON Logic decision rules remain in the form. Both malformed inputs now return `INVALID_INTERVAL` in the native UI. See `dist/evidence/regression-ui.json` and `dist/evidence/validation-fixed.jpg`. Both shared eight-case suites were repeated successfully after the repair.
