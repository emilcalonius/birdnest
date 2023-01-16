<script lang="ts">
import { PropType } from 'vue';
import { IPilot } from '../types/Types';

export default {
    name: "ListItem",
    props: {
        date: String,
        serialNum: String,
        pilot: {
            type: Object as PropType<IPilot>
        },
        distance: Number
    },
    computed: {
        formattedTime() {
            const date = new Date(this.date as string);

            let hours = String(date.getHours());
            if(hours.length === 1) hours = `0${hours}`;

            let mins = String(date.getMinutes());
            if(mins.length === 1) mins = `0${mins}`;

            let secs = String(date.getSeconds());
            if(secs.length === 1) secs = `0${secs}`;

            return `${hours}:${mins}:${secs}`;
        },
        pilotFullName() {
            return this.pilot?.firstName + " " + this.pilot?.lastName;
        }
    }
}
</script>

<template>
    <li class="list-item" v-if="pilot">
        <div class="side"></div>
        <div class="pilot">
            <div class="name">
                <h5>Name:</h5>
                <p>{{ pilotFullName }}</p>
            </div>
            <div class="time">
                <h5>Time:</h5>
                <p>{{ formattedTime }}</p>
            </div>
            <div class="distance">
                <h5>Distance from nest:</h5>
                <p>{{ distance }}m</p>
            </div>
            <div class="phone">
                <h5>Phone:</h5>
                <p>{{ pilot.phoneNumber }}</p>
            </div>
            <div class="email">
                <h5>Email:</h5>
                <p>{{ pilot.email }}</p>
            </div>
        </div>
    </li>
    <img src="../assets/loading.gif" alt="loading indicator" class="loading" v-else />
</template>

<style scoped>
.loading {
    width: 3rem;
}

.list-item {
    display: flex;
    gap: 1rem;
    background-color: hsl(235, 16%, 15%);
    border: 2px solid black;
    border-radius: 5px;
    width: 525px;
    height: 9rem;
}

.side {
    background-color: hsl(0, 43%, 53%);
    width: 10px;
    height: 100%;
    border-radius: 5px 0px 0px 5px;
}

.pilot {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    padding: 0.5rem;
    width: 490px;
}

.name, .email, .phone, .time, .distance {
    display: flex;
    flex-direction: column;
}

.email {
    grid-column: 2 / span 2;
}

p, h5 {
    margin: 0;
}
</style>