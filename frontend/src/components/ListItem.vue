<script lang="ts">
import { PropType } from 'vue';
import { IPilot } from '../types/Pilot';

export default {
    name: "ListItem",
    props: {
        date: String,
        serialNum: String,
        pilot: {
            type: Object as PropType<IPilot>
        }
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
    <li class="list-item">
        <div class="side"></div>
        <div class="pilot">
            <div class="time">
                <h5>Time</h5>
                <p>{{ formattedTime }}</p>
            </div>
            <div class="name">
                <h5>Name</h5>
                <p>{{ pilotFullName }}</p>
            </div>
            <div class="email">
                <h5>Email</h5>
                <p>{{ pilot?.email }}</p>
            </div>
            <div class="phone">
                <h5>Phone</h5>
                <p>{{ pilot?.phoneNumber }}</p>
            </div>
        </div>
        
    </li>
</template>

<style scoped>
.list-item {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
    background-color: hsl(235, 16%, 15%);
    border: 2px solid black;
    border-radius: 5px;
    width: 490px;
    height: 18rem;
}

.side {
    background-color: hsl(0, 43%, 53%);
    width: 1rem;
    height: 100%;
    border-radius: 5px 0px 0px 5px;
}

.pilot {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    padding: 2rem;
}

.name, .email, .phone, .time {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>