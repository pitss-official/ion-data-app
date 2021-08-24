## About the application
- Stores the sampled data from sensors via /data endpoint for multiple sensors (sampled at each minute)
- Uses Mongo's timeseries collection optimized for IOT data collection
- It exposes /data endpoint for fetching sensor data based on sensorId and groupBy query params
- It asynchronously stores data in chunks when a large data file is uploaded via endpoints
- It uses node streams to process the data thus avoids memory overflows

## Future Scope
- Push data to graph in realtime as chunks are processed by the server

## Steps to Run via terminal
 - Open two terminals one inside `/client` and one inside '/server'
 - run `npm install` inside both the terminals for installing dependencies
 - run `npm start` inside inside client folder
 - update `.env` file inside server folder with appropriate mongo credentials
 - ensure that mongo running
 - run `npm start` for starting the server

## Steps to Run via docker
 - Run `docker compose up --build --remove-orphans` to setup the cluster and open `localhost:3000` once done
 
