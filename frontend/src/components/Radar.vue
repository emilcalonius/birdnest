<script lang="ts">
import axios from 'axios';
import { IDrone } from '../types/Drone';

export default {
    name: "Radar",
    data() {
        return {
            drones: [] as IDrone[]
        }
    },
    methods: {
        initCanvas(): void {
            const canvas = document.querySelector(".canvas") as HTMLCanvasElement;
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

            ctx.strokeStyle = "red";
            ctx.lineWidth = 2;
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
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(250, 250, 100, 0, 2 * Math.PI);
            ctx.stroke();

            this.drones.forEach((drone: IDrone) => {
                const x = Math.ceil(drone.positionX / 1000);
                const y = Math.ceil(drone.positionY / 1000);
                
                ctx.fillStyle = "hsla(120, 100%, 47%, 0.42)";
                ctx.fillRect(x, y, 10, 10);
            })
        }
    },
    mounted() {
        this.initCanvas();

        setInterval(async () => {
            const axiosResponse = await axios.get("http://localhost:3000/api/drones");
            this.drones = axiosResponse.data as IDrone[];

            this.drawDrones();
        }, 2000);
    }
}
</script>

<template>
    <div class="radar-container">
        <div class="radar">
            <div class="sweep"></div>
            <canvas class="canvas"></canvas>
        </div>
    </div>
</template>

<style scoped>
.radar {
    height: 700px;
    width: 700px;
    border: 2px solid var(--radar-green);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: repeating-radial-gradient(transparent, transparent 58px, var(--radar-green) 60px, var(--radar-green) 62px);
    background-color: hsla(0, 0%, 0%, 0.39);
    position: relative;
}

.sweep {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 50%;
    height: 50%;
    border-left: 3px solid var(--radar-green);
    animation: sweep 10s infinite linear;
    transform-origin: left top;
    background: linear-gradient(80deg, var(--radar-green) 1%, transparent 17%);
    
}

@keyframes sweep {
    to {
        transform: rotate(360deg);
    }
}
</style>