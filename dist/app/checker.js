(function (root) {
  'use strict';
  const node = typeof module !== 'undefined' && module.exports;
  const rules = node ? require('./booking-rules.js') : root.CampusBookingRules;
  const fixtures = node ? require('./fixtures.js') : root.CampusFixtures;
  const room = fixtures.ROOMS.find(item => item.id === 'atlas');
  const messages = {
    AVAILABLE: 'The room is free for this interval.',
    OVERLAP: 'This interval overlaps an existing booking.',
    BLOCKED: 'The room is blocked for maintenance.',
    INVALID_INTERVAL: 'Enter a valid time and a positive whole number of minutes. Finish by 24:00.',
    TOO_LONG: 'Use a duration of 120 minutes or less.',
    NOT_FUTURE: 'Choose a start time after the 09:00 demo clock.'
  };
  function validate(start, duration) {
    const from = rules.parseTime(start);
    const length = typeof duration === 'number' ? duration : (typeof duration === 'string' && /^[-+]?\d+(?:\.\d+)?$/.test(duration.trim()) ? Number(duration) : NaN);
    if (!Number.isInteger(from) || !Number.isInteger(length) || length <= 0 || from + length > 1440) return null;
    return { start: from, end: from + length };
  }
  function check(input) {
    const interval = validate(input.start,input.duration);
    const code = interval ? rules.checkAvailability({...interval, room:{...room, blocked:input.blocked === true}}).code : 'INVALID_INTERVAL';
    return {available:code === 'AVAILABLE', code, message:messages[code]};
  }
  const api = {check, validate, bookings: () => room.bookings.map(slot => [slot.start,slot.end])};
  if (node) module.exports=api; else root.CampusChecker=api;
})(typeof window === 'undefined' ? null : window);
