const fs = require("fs");
const {Writable} = require("stream");
const db = require('../config/mongodb.config');

const BATCH_SIZE = 100;
const sensorDataTimeSeries = db.collection('sensorDataTimeSeries');

module.exports = async function processFile({filePath, id, requestId}) {
    let chunk = [];
    const fileStream = fs.createReadStream(filePath);
    const jsonStream = require('stream-json/streamers/StreamArray').withParser();
    const processingStream = new Writable({
        async write({key, value: {ts, val: temp}}, encoding, callback) {
            if (chunk.length < BATCH_SIZE) {
                chunk.push({
                    sensorId: id,
                    timestamp: new Date(ts),
                    temp,
                });
                if (chunk.length === BATCH_SIZE) {
                    console.log(`Processing chunk of size ${BATCH_SIZE} for sensor ${id} - requestId ${requestId}`)
                    await sensorDataTimeSeries.insertMany(chunk);
                    chunk = [];
                }
                callback();
            }
        }, objectMode: true
    });
    fileStream.pipe(jsonStream.input);
    jsonStream.pipe(processingStream);
    jsonStream.on('error', (err) => {
        console.error(err)
    })
    processingStream.on('finish', async () => {
        if (chunk.length) {
            console.log(`Processing last chunk of size ${chunk.length} for sensor ${id} - requestId ${requestId}`)
            sensorDataTimeSeries.insertMany(chunk);
        }
        console.log(`All done for request ${requestId}`);
    });
}
