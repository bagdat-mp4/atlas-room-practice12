(function () {
  'use strict';

  const CURRENT_TIME = 540;

  function parseTime(value) {
    if (typeof value !== 'string') return NaN;
    const match = /^(\d{2}):(\d{2})$/.exec(value.trim());
    if (!match) return NaN;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (minutes > 59 || hours > 24 || (hours === 24 && minutes !== 0)) return NaN;
    return hours * 60 + minutes;
  }

  function formatTime(minutes) {
    return String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0');
  }

  function checkAvailability({ start, end, now = CURRENT_TIME, room }) {
    const unavailable = (code, reason) => ({ available: false, decision: 'Unavailable', code, reason });
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end > 1440 || start >= end) {
      return unavailable('INVALID_INTERVAL', 'Enter a valid time range: 00:00 to 24:00, with the end after the start.');
    }
    if (!Number.isInteger(now) || now < 0 || now > 1440) {
      return unavailable('INVALID_NOW', 'The supplied current time must be within the same day.');
    }
    if (start <= now) return unavailable('NOT_FUTURE', 'Start time must be later than the demo clock (' + formatTime(now) + ').');
    if (end - start > 120) return unavailable('TOO_LONG', 'The maximum duration is 120 minutes. This request is ' + (end - start) + ' minutes.');
    if (!room || !Array.isArray(room.bookings)) return unavailable('NO_ROOM', 'Select a valid room.');
    if (room.blocked) return unavailable('BLOCKED', 'This room is blocked for maintenance. Choose another room.');
    const conflict = room.bookings.find(booking => start < booking.end && end > booking.start);
    if (conflict) return unavailable('OVERLAP', 'This time overlaps an existing booking (' + formatTime(conflict.start) + ' to ' + formatTime(conflict.end) + ').');
    return { available: true, decision: 'Available', code: 'AVAILABLE', reason: 'The room is free for this ' + (end - start) + '-minute interval. No booking has been created.' };
  }

  const api = { CURRENT_TIME, parseTime, formatTime, checkAvailability };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.CampusBookingRules = api;
})();
