const express = require('express');
const path = require('path');
const fs = require('fs');
const guid = require('guid');
const processFile = require("../logic/process-file");

const router = express.Router();

const db = require('../config/mongodb.config');
const sensorDataTimeSeries = db.collection('sensorDataTimeSeries');
const validateDataSubmitRequest = (req, res, next) => {
    if (req.headers['content-type'] !== 'application/json') {
        res.status(400).send({
            error: 'Invalid File Format. Only json files are supported by this service.'
        });
        next(new Error('validationError'));
    }
    if (!req.query.serial) {
        res.status(400).send({error: 'Serial is a mandatory param.'});
        next(new Error('validationError'));
    }
    next();
}
router.route('/data')
    .post(validateDataSubmitRequest, (req, res) => {
        const id = req.query.serial;
        const requestId = guid.create();
        const filePath = path.join(__dirname, '..', '..', 'uploads', `${id}-${requestId}.json`);
        let fileStream = fs.createWriteStream(filePath);
        req.pipe(fileStream);
        req.on('end', async () => {
            await fileStream.close();
            processFile({filePath, id, requestId});
            res.status(202).send({status: 'File uploaded successfully. Processing Asynchronously.'});
        })
    })
    .get(async (req, res) => {
        const groupBy = (req.query.groupBy || ['year', 'month', 'day']);
        const sensorId = req.query.sensorId;
        let dt = await sensorDataTimeSeries.aggregate([
            ...sensorId ? [{$match: {sensorId}}] : [],
            {
                $project: {
                    date: {
                        $dateToParts: {date: "$timestamp"}
                    },
                    temp: 1,
                    sensorId: 1
                }
            },
            {
                $group: {
                    _id: {
                        ...sensorId ? [] : {sensorId: '$sensorId'},
                        date: groupBy.reduce((obj, filter) => ({...obj, [filter]: `$date.${filter}`}), {})
                    },
                    avgTmp: {$avg: "$temp"},
                }
            },
            {
                $sort: {
                    '_id.sensorId': 1,
                    '_id.date.day': 1,
                    '_id.date.month': 1,
                    '_id.date.year': 1
                }
            }
        ]).toArray();
        res.send(dt)
    });


module.exports = router;
