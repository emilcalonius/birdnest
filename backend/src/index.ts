import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { xml2json } from 'xml-js';
import fs from 'fs';

const app = express();
const port = 3000;

const corsOptions = {
    origin: "*"
}

app.use(cors(corsOptions));

interface IDrone {
    positionX: number;
    positionY: number;
    serialNumber: string;
}

fs.writeFileSync(process.cwd() + '\\violations.json', JSON.stringify({}, null, "\t"));
fs.writeFileSync(process.cwd() + '\\drones.json', JSON.stringify({}, null, "\t"));

const getDroneArray = json => {
    const drones: Array<IDrone> = [];
    json.report.capture.drone.forEach(drone => {
        const newDrone = {
            positionX: Number(drone.positionX._text),
            positionY: Number(drone.positionY._text),
            serialNumber: drone.serialNumber._text
        }
        drones.push(newDrone);
    });
    return drones;
}

const listviolations = (drones: IDrone[]) => {
    try {
        const violations: IDrone[] = drones.filter(drone => {
            return (250000 - 100000 < drone.positionX && drone.positionX < 250000 + 100000) && 
                (250000 - 100000 < drone.positionY && drone.positionY < 250000 + 100000);
        });

        let content = JSON.parse(fs.readFileSync(process.cwd() + '\\violations.json', 'utf8'));
        violations.forEach((drone: IDrone) => {
            content[drone.serialNumber] = new Date();
        })
        fs.writeFileSync(process.cwd() + '\\violations.json', JSON.stringify(content, null, "\t"));
    } catch(err) {
        console.log(err);
    }
}

const removeExpiredViolations = () => {
    try {
        let content = JSON.parse(fs.readFileSync(process.cwd() + '\\violations.json', 'utf8'));
        Object.keys(content).forEach((key: string) => {
            const TEN_MINUTES = 1000 * 60 * 10; //ten minutes in milliseconds
            const tenMinutesAgo = Date.now() - TEN_MINUTES;
            if(Date.parse(content[key]) < tenMinutesAgo) delete content[key];

        })
        fs.writeFileSync(process.cwd() + '\\violations.json', JSON.stringify(content, null, "\t"));
    } catch(err) {
        console.log(err);
    }
}

const listDrones = (drones: IDrone[]) => {
    try {
        let content = {};
        drones.forEach((drone: IDrone) => {
            content[drone.serialNumber] = drone;
        })
        fs.writeFileSync(process.cwd() + '\\drones.json', JSON.stringify(content, null, "\t"));
    } catch(err) {
        console.log(err);
    }
}

// Fetch drones, list airspace violations and remove expired violations every 2 seconds
setInterval(async () => {
    try {
        const axiosResponse = await axios.get("https://assignments.reaktor.com/birdnest/drones");
        const json = JSON.parse(xml2json(axiosResponse.data, { compact: true }));
        
        const droneArray = getDroneArray(json);
        listDrones(droneArray);
        listviolations(droneArray);
        removeExpiredViolations();
    } catch(err) {
        console.log(err);
    }
}, 2000);

app.get('/api/drones', async (req, res) => {
    try {
        let content = JSON.parse(fs.readFileSync(process.cwd() + '\\drones.json', 'utf8'));
        const arr = new Array<Array<number>>();
        Object.keys(content).forEach(key => {
            arr.push(content[key]);
        });
        res.send(arr);
    } catch(err) {
        console.log(err);
    }
});

app.get('/api/violations', (req, res) => {
    try {
        let content = JSON.parse(fs.readFileSync(process.cwd() + '\\violations.json', 'utf8'));
        const arr = new Array<Array<string>>();
        Object.keys(content).forEach(key => {
            arr.push([key, content[key]]);
        });
        res.send(arr);
    } catch(err) {
        console.log(err);
    }
});

app.get('/api/pilots/:serialNumber', async (req, res) => {
    try {
        const axiosResponse = await axios.get(`https://assignments.reaktor.com/birdnest/pilots/${req.params["serialNumber"]}`);
        res.send(axiosResponse.data);
    } catch(err) {
        console.log(err);
    }
});
  
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});