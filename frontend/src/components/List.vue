<script lang="ts">
import axios from 'axios';
import ListItem from './ListItem.vue';
import { IViolation } from '../types/Violation';
import { IPilot } from '../types/Pilot';

export default {
    name: "List",
    data() {
        return {
            violations: [] as IViolation[],
            pilots: [] as IPilot[]
        }
    },
    computed: {
        sortedViolations() {
            const violationsList = this.violations;
            violationsList.sort((a: IViolation, b: IViolation) => Date.parse(b.date) - Date.parse(a.date));
            return violationsList;
        }
    },
    created() {
        setInterval(async () => {
            const violationResponse = await axios.get("http://localhost:3000/api/violations");
            const violationsList = violationResponse.data;
            this.violations = violationsList;
            const pilotResponse = await axios.get("http://localhost:3000/api/pilots");
            const pilots = pilotResponse.data;
            this.pilots = pilots;
        }, 2000);
    },
    components: { ListItem }
}
</script>

<template>
    <div class="list-container">
        <h1 class="header">Violations</h1>
        <div class="list">
            <ul class="violations-list">
                <ListItem 
                    v-for="violation in sortedViolations" 
                    :date="violation.date" 
                    :serial-num="violation.droneSerialNumber" 
                    :pilot="pilots.find(elem => elem.droneSerialNumber === violation.droneSerialNumber)"
                    :distance="Math.floor(violation.distanceFromNest / 1000)"
                />
            </ul>
        </div>
    </div>
</template>

<style scoped>
.header {
    padding-left: 1.5rem;
}

.list {
    overflow-y: scroll;
    padding: 0 1.5rem 0 1.5rem;
    width: 550px;
    height: 900px;
}

.violations-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
}
</style>
