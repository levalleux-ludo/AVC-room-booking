const schedule = require('node-schedule');
const roomService = require('../rooms/room.service');
const userService = require('../users/user.service');
const imageService = require('../images/images.service');
const fileService = require('../files/files.service');
const bookingService = require('../bookings/booking.service');


const schedulePattern = '0 0 0 * * *'; // every day at 0:00:00 = 0 0 0 * * *
const schedulePatternTest = '0 * * * * *'; // every minute

// Every day, look for undefined references in data model
// -for instance a user references an organization that is no longer in the database
var j = schedule.scheduleJob(schedulePattern, roomService.cleanUndefinedRefs);
var k = schedule.scheduleJob(schedulePattern, userService.cleanUndefinedRefs);
var l = schedule.scheduleJob(schedulePattern, imageService.removeUnusedImages);
var m = schedule.scheduleJob(schedulePattern, fileService.removeUnusedFiles);
var m = schedule.scheduleJob(schedulePattern, bookingService.cleanUndefinedRefs);