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
        fetchViolations() {
            axios.get(`${import.meta.env.VITE_BACKEND_HOST}/api/violations`)
                .then(res => res.data)
                .then(data => this.violations = data);
            axios.get(`${import.meta.env.VITE_BACKEND_HOST}/api/pilots`)
                .then(res => res.data)
                .then(data => {
                    this.pilots = data;
                    this.loading = false;
                });
        }
    },
    async created() {
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
    width: 50px;
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
