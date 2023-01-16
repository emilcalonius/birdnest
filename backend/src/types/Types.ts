export interface IDrone {
    positionX: number;
    positionY: number;
    serialNumber: string;
    model: string;
    manufacturer: string;
    mac: string;
    ipv4: string;
    ipv6: string;
    firmware: string;
    altitude: string;
}

export interface IPilot {
    pilotId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    createdDt: string;
    email: string;
    droneSerialNumber: string;
}

export interface IViolation {
    date: string;
    distanceFromNest: number;
    droneSerialNumber: string;
}