import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { xml2json } from 'xml-js';
import fs from 'fs';
import { getDroneArray, listViolations, listDrones, removeExpiredViolations, listPilots } from './utils/DroneUtils.js';
import { IViolation, IPilot } from './types/Types.js';

const app = express();
const port = 3000;

const corsOptions = {
    origin: "*"
}

app.use(cors(corsOptions));

fs.writeFileSync('./src/violations.json', JSON.stringify({}, null, "\t"));
fs.writeFileSync('./src/drones.json', JSON.stringify({}, null, "\t"));
fs.writeFileSync('./src/pilots.json', JSON.stringify({}, null, "\t"));

// Fetch drones, list airspace violations and remove expired violations every 2 seconds
setInterval(async () => {
    try {
        const axiosResponse = await axios.get("https://assignments.reaktor.com/birdnest/drones");
        const json = JSON.parse(xml2json(axiosResponse.data, { compact: true }));
        
        const droneArray = getDroneArray(json);

        listDrones(droneArray);
        listViolations(droneArray);
        listPilots();

        removeExpiredViolations();
    } catch(err) {
        console.log(err);
    }
}, 2000);

app.get('/api/drones', async (req, res) => {
    try {
        const drones = JSON.parse(fs.readFileSync('./src/drones.json', 'utf8'));
        const arr = new Array<Array<number>>();
        Object.keys(drones).forEach(key => {
            arr.push(drones[key]);
        });
        res.send(arr);
    } catch(err) {
        console.log(err);
    }
});

app.get('/api/violations', (req, res) => {
    try {
        const violations = JSON.parse(fs.readFileSync('./src/violations.json', 'utf8'));
        const arr = new Array<IViolation>;
        Object.keys(violations).forEach(key => {
            arr.push(violations[key]);
        });
        res.send(arr);
    } catch(err) {
        console.log(err);
    }
});

app.get('/api/pilots', async (req, res) => {
    try {
        const pilots = JSON.parse(fs.readFileSync('./src/pilots.json', 'utf8'));
        const arr = new Array<IPilot>;
        Object.keys(pilots).forEach(key => {
            arr.push(pilots[key]);
        });
        res.send(arr);
    } catch(err) {
        console.log(err);
    }
});
  
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});