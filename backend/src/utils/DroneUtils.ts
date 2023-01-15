import axios from 'axios';
import fs from 'fs';
import { IDrone } from '../types/Drone.js';
import { IPilot } from '../types/Pilot.js';

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

export const removeExpiredViolations = () => {
    try {
        let violations = JSON.parse(fs.readFileSync(process.cwd() + '\\violations.json', 'utf8'));
        Object.keys(violations).forEach((key: string) => {
            const TEN_MINUTES = 1000 * 60 * 10;
            const tenMinutesAgo = Date.now() - TEN_MINUTES;
            if(Date.parse(violations[key]) < tenMinutesAgo) delete violations[key];
        });
        const pilots = JSON.parse(fs.readFileSync(process.cwd() + '\\pilots.json', 'utf8'));
        Object.keys(pilots).forEach((key) => {
            if(!Object.keys(violations).includes(key)) delete pilots[key];
        })
        fs.writeFileSync(process.cwd() + '\\violations.json', JSON.stringify(violations, null, "\t"));
        fs.writeFileSync(process.cwd() + '\\pilots.json', JSON.stringify(pilots, null, "\t"));
    } catch(err) {
        console.log(err);
    }
}

export const listDrones = (drones: IDrone[]) => {
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

export const listPilots = () => {
    try {
        let violations = JSON.parse(fs.readFileSync(process.cwd() + '\\violations.json', 'utf8'));
        const pilots = JSON.parse(fs.readFileSync(process.cwd() + '\\pilots.json', 'utf8'));
        Object.keys(violations).forEach((key) => {
            if(!Object.keys(pilots).includes(key)) {
                axios.get("https://assignments.reaktor.com/birdnest/pilots/"+key)
                .then(res => res.data)
                .then(pilot => {
                    pilots[key] = pilot;
                    fs.writeFileSync(process.cwd() + '\\pilots.json', JSON.stringify(pilots, null, "\t"));
                });
            }
        })
    } catch(err) {
        console.log(err);
    }
}