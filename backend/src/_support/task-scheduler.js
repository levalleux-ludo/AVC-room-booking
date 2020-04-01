const schedule = require('node-schedule');
const roomService = require('../rooms/room.service');
const userService = require('../users/user.service');
const imageService = require('../images/images.service');


const schedulePattern = '0 */2 * * * *';

// Every hour, look for undefined references in data model
// -for instance a user references an organization that is no longer in the database
var j = schedule.scheduleJob(schedulePattern, roomService.cleanUndefinedRefs);
var k = schedule.scheduleJob(schedulePattern, userService.cleanUndefinedRefs);
var l = schedule.scheduleJob(schedulePattern, imageService.removeUnusedImages);