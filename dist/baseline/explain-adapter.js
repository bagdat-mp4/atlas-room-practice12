(function () {
  'use strict';
  const KNOWN_CODES = Object.freeze(['AVAILABLE', 'INVALID_INTERVAL', 'INVALID_NOW', 'NOT_FUTURE', 'TOO_LONG', 'NO_ROOM', 'BLOCKED', 'OVERLAP']);
  function minutes(text) {
    if (typeof text !== 'string' || !/^\d{2}:\d{2}$/.test(text)) return NaN;
    const [h, m] = text.split(':').map(Number);
    return h <= 24 && m < 60 && (h !== 24 || m === 0) ? h * 60 + m : NaN;
  }
  function validateRequest(r) {
    if (!r || typeof r !== 'object' || Array.isArray(r)) return 'INVALID_REQUEST';
    if (typeof r.roomLabel !== 'string' || !r.roomLabel.trim() || r.roomLabel.length > 80) return 'INVALID_REQUEST';
    if (!Number.isFinite(minutes(r.start)) || !Number.isFinite(minutes(r.end)) || minutes(r.start) >= minutes(r.end)) return 'INVALID_REQUEST';
    if (typeof r.isAvailable !== 'boolean' || !KNOWN_CODES.includes(r.reasonCode) || r.isAvailable !== (r.reasonCode === 'AVAILABLE')) return 'INVALID_REQUEST';
    return null;
  }
  function approvedText(r) {
    if (r.isAvailable) return r.roomLabel + ' is free from ' + r.start + ' to ' + r.end + '.';
    if (r.reasonCode === 'OVERLAP') return r.roomLabel + ' is unavailable because an existing booking overlaps ' + r.start + ' to ' + r.end + '.';
    const reasons = { BLOCKED: 'the room is blocked for maintenance', NOT_FUTURE: 'the start is not later than the demo clock', TOO_LONG: 'the request exceeds 120 minutes', NO_ROOM: 'no valid room was selected', INVALID_INTERVAL: 'the requested interval is invalid', INVALID_NOW: 'the supplied demo clock is invalid' };
    return r.roomLabel + ' is unavailable because ' + reasons[r.reasonCode] + '.';
  }
  function validateResponse(value, request) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length !== 1 || typeof value.explanation !== 'string' || !value.explanation.trim() || value.explanation.length > 240) return 'MALFORMED_OUTPUT';
    const sentences = value.explanation.split(/[.!?](?:\s|$)/).filter(s => s.trim()).length;
    if (sentences > 2) return 'MALFORMED_OUTPUT';
    return value.explanation === approvedText(request) ? null : 'CONTRADICTORY_OUTPUT';
  }
  function fallbackText(result) { return ('Deterministic fallback: ' + result.reason).slice(0, 240); }
  function createMockExplainAdapter(config = {}) {
    return function explain(request, options = {}) {
      const invalid = validateRequest(request);
      if (invalid) return Promise.reject(Object.assign(new Error(invalid), { code: invalid }));
      const mode = config.mode || 'normal';
      return new Promise((resolve, reject) => {
        let work, deadline, settled = false;
        const finish = (error, value) => {
          if (settled) return;
          settled = true; clearTimeout(work); clearTimeout(deadline);
          options.signal?.removeEventListener('abort', abort);
          error ? reject(Object.assign(new Error(error), { code: error })) : resolve(value);
        };
        const abort = () => finish('ABORTED');
        if (options.signal?.aborted) { finish('ABORTED'); return; }
        options.signal?.addEventListener('abort', abort, { once: true });
        deadline = setTimeout(() => finish('TIMEOUT'), config.deadlineMs ?? 150);
        if (mode === 'timeout') return;
        work = setTimeout(() => {
          if (mode === 'api-failure') { finish('API_FAILURE'); return; }
          if (mode === 'missing-key') { finish('MISSING_KEY'); return; }
          const response = mode === 'malformed' ? { explanation: 42 } : mode === 'long' ? { explanation: 'x'.repeat(241) } : mode === 'contradictory' ? { explanation: request.isAvailable ? 'The room is unavailable.' : 'The room is free.' } : { explanation: approvedText(request) };
          finish(validateResponse(response, request), response);
        }, config.delayMs ?? 5);
      });
    };
  }
  const api = { createMockExplainAdapter, validateRequest, validateResponse, fallbackText, KNOWN_CODES };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.CampusExplainAdapter = api;
})();
