(function () {
  'use strict';

  const isNode = typeof module !== 'undefined' && module.exports;
  const rules = isNode ? require('./booking-rules.js') : window.CampusBookingRules;
  const fixtures = isNode ? require('./fixtures.js') : window.CampusFixtures;

  const api = {
    CURRENT_TIME: rules.CURRENT_TIME,
    ROOMS: fixtures.ROOMS,
    parseTime: rules.parseTime,
    formatTime: rules.formatTime,
    checkAvailability: rules.checkAvailability
  };
  if (isNode) module.exports = api;
  else window.CampusAvailability = api;
})();
