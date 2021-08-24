const express = require('express');
const path = require('path');
const fs = require('fs');
const guid = require('guid');
const processFile = require("../logic/process-file");
const Busboy = require('busboy');

const router = express.Router();

const db = require('../config/mongodb.config');
const sensorDataTimeSeries = db.collection('sensorDataTimeSeries');

router.route('/data')
    .post((req, res) => {
        const requestId = guid.create();
        const busboy = new Busboy({ headers: req.headers });
        let filePath, id;

        req.pipe(busboy)

        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            if (mimetype!=='application/json'){
                res.status(400).send({error:'File is expected to be a type of json'});
                return;
            }
            id = req.query.serial || filename.slice(0,-5);
            filePath = path.join(__dirname, '..', '..', 'uploads', `${id}-${requestId}.json`);
            file.pipe(fs.createWriteStream(filePath));
        });
        busboy.on('finish', function() {
            res.status(202).send({status: 'File uploaded successfully. Processing Asynchronously.'});
            processFile({filePath, id, requestId});
        });
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
