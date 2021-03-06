﻿require('module-alias/register')
const app = require('@src/app');

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function() {
    console.log('Server listening on port ' + port);
});

module.exports = server; // Required for API testing with chai