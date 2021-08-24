const express = require( 'express');
const router = require( '././routes');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.port || 8080;

app.use(cors())

app.use('/api', router);

app.listen(PORT, function () {
    console.log(`Server Listening on ${PORT}`);
});
