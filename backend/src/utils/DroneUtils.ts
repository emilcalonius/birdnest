import axios from 'axios';
import fs from 'fs';
import { IDrone, IViolation } from '../types/Types.js';

export const getDroneArray = json => {
    const drones: Array<IDrone> = [];
    json.report.capture.drone.forEach(drone => {
        const newDrone = {
            positionX: Number(drone.positionX._text),
            positionY: Number(drone.positionY._text),
            serialNumber: drone.serialNumber._text,
            model: drone.model._text,
            manufacturer: drone.manufacturer._text,
            mac: drone.mac._text,
            ipv4: drone.ipv4._text,
            ipv6: drone.ipv6._text,
            firmware: drone.firmware._text,
            altitude: drone.altitude._text
        }
        
        drones.push(newDrone);
    });
    return drones;
}

export const listViolations = (drones: IDrone[]) => {
    try {
        const previousViolations: IDrone[] = drones.filter(drone => {
            return 100000 > Math.abs(Math.sqrt(Math.pow(250000-drone.positionX, 2)
                +Math.pow(250000-drone.positionY, 2)));
        });

        let violations = JSON.parse(fs.readFileSync('./src/violations.json', 'utf8'));
        previousViolations.forEach((drone: IDrone) => {
            const violation = {} as IViolation;
            const date = new Date();

            violation.date = date.toISOString();
            violation.droneSerialNumber = drone.serialNumber;

            const distance = Math.abs(Math.sqrt(Math.pow(250000-drone.positionX, 2)
                +Math.pow(250000-drone.positionY, 2)));
            if(Object.keys(violations).includes(drone.serialNumber)) {
                if(violations[drone.serialNumber].distanceFromNest > distance) {
                    violation.distanceFromNest = distance;
                } else {
                    violation.distanceFromNest = violations[drone.serialNumber].distanceFromNest;
                }
            } else {
                violation.distanceFromNest = distance;
            }
            violations[drone.serialNumber] = violation;
        })
        fs.writeFileSync('./src/violations.json', JSON.stringify(violations, null, "\t"));
    } catch(err) {
        console.log(err);
    }
}

export const removeExpiredViolations = () => {
    try {
        const violations = JSON.parse(fs.readFileSync('./src/violations.json', 'utf8'));
        Object.keys(violations).forEach((key: string) => {
            const TEN_MINUTES = 1000 * 60 * 10;
            const tenMinutesAgo = Date.now() - TEN_MINUTES;
            if(Date.parse(violations[key].date) < tenMinutesAgo) delete violations[key];
        });

        const pilots = JSON.parse(fs.readFileSync('./src/pilots.json', 'utf8'));
        Object.keys(pilots).forEach((key) => {
            if(!Object.keys(violations).includes(key)) delete pilots[key];
        });

        fs.writeFileSync('./src/violations.json', JSON.stringify(violations, null, "\t"));
        fs.writeFileSync('./src/pilots.json', JSON.stringify(pilots, null, "\t"));
    } catch(err) {
        console.log(err);
    }
}

export const listDrones = (dronesArr: IDrone[]) => {
    try {
        let drones = {};
        dronesArr.forEach((drone: IDrone) => {
            drones[drone.serialNumber] = drone;
        })

        fs.writeFileSync('./src/drones.json', JSON.stringify(drones, null, "\t"));
    } catch(err) {
        console.log(err);
    }
}

export const listPilots = () => {
    try {
        const violations = JSON.parse(fs.readFileSync('./src/violations.json', 'utf8'));
        const pilots = JSON.parse(fs.readFileSync('./src/pilots.json', 'utf8'));
        Object.keys(violations).forEach((key) => {
            if(!Object.keys(pilots).includes(key)) {
                axios.get("https://assignments.reaktor.com/birdnest/pilots/"+key)
                .then(res => res.data)
                .then(pilot => {
                    pilot.droneSerialNumber = key;
                    pilots[key] = pilot;
                    fs.writeFileSync('./src/pilots.json', JSON.stringify(pilots, null, "\t"));
                });
            }
        })
    } catch(err) {
        console.log(err);
    }
}