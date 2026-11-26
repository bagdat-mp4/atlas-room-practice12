(function () {
  'use strict';

  const ROOMS = Object.freeze([
    Object.freeze({ id: 'atlas', name: 'Atlas 204', type: 'Seminar room', capacity: 32, blocked: false,
      bookings: Object.freeze([Object.freeze({ start: 600, end: 660 }), Object.freeze({ start: 870, end: 930 })]) }),
    Object.freeze({ id: 'nova', name: 'Nova 108', type: 'Study room', capacity: 12, blocked: false,
      bookings: Object.freeze([]) }),
    Object.freeze({ id: 'studio', name: 'Studio 310', type: 'Project room', capacity: 20, blocked: true,
      bookings: Object.freeze([]) })
  ]);

  const api = { ROOMS };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.CampusFixtures = api;
})();
