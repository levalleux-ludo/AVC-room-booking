const moment = require('moment');

function computeEndingTime(startTime, durationHours) {
    let res = moment.utc(startTime);
    if (durationHours > 0) {
        res = res.add(durationHours, 'hours');
    } else {
        res = res.subtract(-durationHours, 'hours');
    }
    return new Date(res.utc());
}

function duration(startDate, endDate) {
    let start = moment(startDate);
    let end = moment(endDate);
    var duration = moment.duration(end.diff(start));
    return duration.asHours();
}

function formatHM(date) {
    let res = moment.utc(date);
    return res.format("h:mma z");
}

function formatDay(date) {
    let res = moment.utc(date);
    return res.format("ddd D MMM YYYY");
}

module.exports = {
    computeEndingTime,
    duration,
    formatHM,
    formatDay
};