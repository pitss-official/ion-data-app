const dotenv = require('dotenv');
const {MongoClient} = require('mongodb');

dotenv.config();

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const {
    MONGO_HOSTNAME='localhost',
    MONGO_DB='sensor_data',
    MONGO_PORT=27017
} = process.env;

const mongoClient = new MongoClient(`mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?retryWrites=true&w=majority`, options);

mongoClient.connect().then(async ()=>{
    console.log('DB Connected');

    try {
        //create a collection to enforce optimization on timeseries collection
        await db.createCollection("sensorDataTimeSeries", {
            timeseries: {
                timeField: "timestamp",
                metaField: "sensorId",
                granularity: "seconds"
            },
        });
    }
    catch (e) {/*collection present*/}
});

const db = mongoClient.db('sensor_data');

module.exports = db;
