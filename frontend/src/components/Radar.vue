<script lang="ts">
import axios from 'axios';
import { IDrone } from '../types/Types';
import DroneInfo from './DroneInfo.vue';

const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST;

export default {
    name: "Radar",
    data() {
        return {
            drones: [] as IDrone[],
            selectedDrone: null as IDrone | null
        };
    },
    methods: {
        initCanvas(): void {
            const canvas = document.querySelector(".canvas") as HTMLCanvasElement;
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(250, 250, 100, 0, 2 * Math.PI);
            ctx.stroke();
            canvas.height = 500;
            canvas.width = 500;
        },
        drawDrones(): void {
            const canvas = document.querySelector(".canvas") as HTMLCanvasElement;
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(250, 250, 100, 0, 2 * Math.PI);
            ctx.stroke();

            this.drones.forEach((drone: IDrone) => {
                const x = drone.positionX / 1000;
                const y = drone.positionY / 1000;

                if (this.selectedDrone && drone.serialNumber === this.selectedDrone.serialNumber) {
                    const indicator = new Path2D();
                    indicator.arc(x, y, 15, 0, 2 * Math.PI);
                    ctx.strokeStyle = "hsla(120, 100%, 47%, 0.42)";
                    ctx.lineWidth = 3;
                    ctx.stroke(indicator);
                }

                const circle = new Path2D();
                circle.arc(x, y, 10, 0, 2 * Math.PI);
                ctx.fillStyle = "hsla(120, 100%, 47%, 0.42)";
                ctx.fill(circle);
            });
        },
        selectDrone(e: MouseEvent) {
            const mouseX = e.offsetX;
            const mouseY = e.offsetY;

            this.drones.forEach((drone: IDrone) => {
                const droneX = drone.positionX / 1000;
                const droneY = drone.positionY / 1000;

                if ((mouseY >= droneY - 10 && mouseY <= droneY + 10) &&
                    (mouseX >= droneX - 10 && mouseX <= droneX + 10)) {
                    this.selectedDrone = drone;
                    this.drawDrones();
                }
            });
        },
        async fetchDrones() {
            const dronesRes = await axios.get(`${BACKEND_HOST}/api/drones`);
            const drones = await dronesRes.data;
            this.drones = drones;
            this.drawDrones();
        }
    },
    mounted() {
        this.initCanvas();
        this.fetchDrones();

        setInterval(() => {
            this.fetchDrones();
        }, 2000);
    },
    components: { DroneInfo }
}
</script>

<template>
    <div class="radar-container">
        <div class="radar">
            <div class="vertical-line"></div>
            <div class="horizontal-line"></div>
            <p class="one hundred">100m</p>
            <p class="two hundred">200m</p>
            <div class="sweep"></div>
            <canvas @click="e => selectDrone(e)" class="canvas"></canvas>
        </div>
        <h1 class="header">Drone information</h1>
        <DroneInfo v-if="selectedDrone" :drone="selectedDrone" />
        <h3 v-else>Select a drone by clicking on it on the radar.</h3>
    </div>
</template>

<style scoped>
.canvas {
    z-index: 1
}

.radar-container {
    width: 570px;
}

.radar {
    height: 500px;
    width: 500px;
    border: 2px solid var(--radar-green);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: repeating-radial-gradient(circle at center, transparent 0px, transparent 47px, var(--radar-green) 51px);
    background-color: hsla(0, 0%, 0%, 0.39);
    position: relative;
    overflow: hidden;
    margin: 0 auto;
}

.sweep {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 50%;
    height: 50%;
    border-left: 3px solid var(--radar-green);
    animation: sweep 4s infinite linear;
    transform-origin: left top;
    background: linear-gradient(80deg, var(--radar-green) 1%, transparent 17%);
}

@keyframes sweep {
    to {
        transform: rotate(360deg);
    }
}

.vertical-line {
    border: 1px solid var(--radar-green);
    height: 500px;
    position: absolute;
}

.horizontal-line {
    border: 1px solid var(--radar-green);
    width: 500px;
    position: absolute;
}

.hundred {
    color: var(--radar-green);
}

.one {
    position: absolute;
    top: 106px;
    left: 255px;
}

.two {
    position: absolute;
    top: 6px;
    left: 255px;
}

.vertical-line, .horizontal-line,
.hundred, .sweep {
    pointer-events: none;
}
</style>