<script lang="ts">
import axios from 'axios';
import ListItem from './ListItem.vue';
import { IViolation, IPilot } from '../types/Types';

const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST;

export default {
    name: "List",
    data() {
        return {
            violations: [] as IViolation[],
            pilots: [] as IPilot[],
            loading: true
        }
    },
    computed: {
        sortedViolations() {
            const violationsList = this.violations;
            violationsList.sort((a: IViolation, b: IViolation) => Date.parse(b.date) - Date.parse(a.date));
            return violationsList;
        }
    },
    methods: {
        async fetchViolations() {
            const violationRes = await axios.get(`${BACKEND_HOST}/api/violations`);
            const violations = await violationRes.data;
            this.violations = violations;

            const pilotRes = await axios.get(`${BACKEND_HOST}/api/pilots`);
            const pilots = await pilotRes.data;
            this.pilots = pilots;

            this.loading = false;
        }
    },
    created() {
        this.fetchViolations();

        setInterval(() => {
            this.fetchViolations();
        }, 2000);
    },
    components: { ListItem }
}
</script>

<template>
    <div class="list-container">
        <h1 class="header">Violations (last 10 minutes)</h1>
        <div class="list">
            <img src="../assets/loading.gif" alt="loading indicator" class="loading" v-if="loading">
            <ul class="violations-list" v-else>
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
.loading {
    width: 3rem;
}

.list {
    overflow-y: scroll;
    width: 570px;
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
