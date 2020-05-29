const db = require('../_helpers/db');
const config = require('../config.json');
const Notifier = db.Notifier;
var CryptoJS = require("crypto-js");
const nodemailer = require("nodemailer");
const bookingService = require('../bookings/booking.service');
const organizationService = require('../organizations/organization.service');
const roomService = require('../rooms/room.service');
const fileService = require('../files/files.service');
var request = require('request');


function stringToArrayBuffer(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function arrayBufferToString(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

module.exports = {
    update,
    get,
    notifyBooking
};

const secret_key = process.env.secret_key || config.secret;

let transporter = undefined;

async function get() {
    return await Notifier.findOne(); // warning: no control if there is only one document in model
}

async function update(notifierParam) {
    const notifier = await Notifier.findOne(); // warning: no control if there is only one document in model

    if (notifierParam.auth) {
        notifierParam.auth.cypherPass = notifier.auth.cypherPass; // be sure the cypherPass is not changed
    }

    if (notifierParam.newPassword) {
        if ((!notifier.auth.cypherPass) || (notifier.auth.cypherPass === '') ||
            (notifierParam.oldPassword === CryptoJS.AES.decrypt(notifier.auth.cypherPass, secret_key).toString(CryptoJS.enc.Utf8))) {
            // old pass is correct OR pass has never been set
            notifierParam.auth.cypherPass = CryptoJS.AES.encrypt(notifierParam.newPassword, secret_key).toString();
        } else {
            throw new Error('Invalid password');
        }
    }

    // copy websiteParam properties to website
    Object.assign(notifier, notifierParam);

    await notifier.save();
    await createTransporter();
}

async function getPdfData(fileId, encryptionKey) {
    return new Promise((resolve, reject) => {
        fileService.getFile(fileId).then(cypherPdfURL => {
            request.get({
                uri: cypherPdfURL.url,
                encoding: null
            }, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (encryptionKey === '') {
                        // no encryption (test ?)
                        resolve(body);
                    } else {
                        var bytesPass = CryptoJS.AES.decrypt(body.text(), encryptionKey);
                        resolve(bytesPass.toString(CryptoJS.enc.Utf8));
                    }
                }
            });
        });
    });
}

async function notifyBooking(bookingId, event) {
    const notifier = await get();
    const booking = await bookingService.getById(bookingId);
    const bookingPrivateData = await bookingService.getPrivateData(booking.privateData);
    const organization = await organizationService.getById(bookingPrivateData.organizationId);
    const room = await roomService.getById(booking.roomId);
    const pdfData = await getPdfData(booking.bookingFormId, bookingPrivateData.encryptionKey);

    let receivers = '';
    for (const receiver of notifier.receivers) {
        receivers += receiver + ' ';
    }
    const subject = 'New Room Booking';
    let text = 'The following booking has been created:\n';
    text += 'Organization: ' + organization.name + '\n';
    text += 'Room: ' + room.name + '\n';
    text += 'From: ' + booking.startDate + '\n';
    text += 'To: ' + booking.endDate + '\n';
    let html = '<p>The following booking has been created:</p>';
    html += '<p>Organization: ' + organization.name + '</p>';
    html += '<p>Room: ' + room.name + '</p>';
    html += '<p>From: ' + booking.startDate + '</p>';
    html += '<p>To: ' + booking.endDate + '</p>';
    const attachments = [{
        filename: booking.ref + '.pdf',
        content: Buffer.from(pdfData)
    }];
    let message = '';
    for (let i = 0; i < 16; i++) {
        message += attachments[0].content[i].toString(16) + ',';
    }
    console.log(message);

    await sendMail(receivers, subject, text, html, attachments);
}

async function sendMail(receivers, subject, text, html, attachments) {
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"AVC room booking" <avc.room.booking@gmail.com>', // sender address
        to: receivers, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
        attachments: attachments
    });

    console.log("Message sent: %s", info.messageId);
}

async function createTransporter() {
    const notifier = await get();
    var bytesPass = CryptoJS.AES.decrypt(notifier.auth.cypherPass, secret_key);
    var clearPass = bytesPass.toString(CryptoJS.enc.Utf8);

    // create reusable transporter object using the default SMTP transport
    transporter = nodemailer.createTransport({
        host: notifier.host,
        port: notifier.port,
        secure: notifier.secure,
        auth: {
            user: notifier.auth.user,
            pass: clearPass
        },
    });

    // sendMail(
    //     notifier.receivers,
    //     "test",
    //     "transporter has been initialized with sender account " + notifier.auth.user,
    //     "<div>transporter has been initialized with sender account " + notifier.auth.user + "</div>", []).then(() => {
    //     console.log('Test message has been sent');
    // });
}

db.eventEmitter.on('connected', () => {
    console.log('notifier check if one document already exists');
    // If there is no document in the collection, then create it 
    Notifier.countDocuments({}).then((count) => {
        if (count === 0) {
            console.log('notifier create document');
            const notifierDefault = new Notifier({}); // default value are defined in Model definition
            notifierDefault.save().then(() => {
                createTransporter();
            });
        } else {
            console.log('notifier document exists. No creation');
            createTransporter();
        }
    });
});