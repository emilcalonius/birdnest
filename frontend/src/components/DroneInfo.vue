<script lang="ts">
import { PropType } from 'vue';
import { IDrone } from '../types/Types';

export default {
    name: "DroneInfo",
    props: {
        drone: {
            type: Object as PropType<IDrone>
        },
    },
}
</script>

<template>
    <div v-if="drone" class="drone-info">
        <h3>Serial number: {{ drone.serialNumber }}</h3>
        <h3>Model: {{ drone.model }}</h3>
        <h3>Manufacturer: {{ drone.manufacturer }}</h3>
        <h5>MAC: {{ drone.mac }}</h5>
        <h5>ipv4: {{ drone.ipv4 }}</h5>
        <h5>ipv6: {{ drone.ipv6 }}</h5>
        <h5>Firmware: {{ drone.firmware }}</h5>
    </div>
</template>

<style scoped>
.header {
    padding-top: 2rem;
}

.drone-info {
    border: 2px solid var(--radar-green);
    padding: 2rem;
    border-radius: 25px;
    background-color: hsla(0, 0%, 0%, 0.39);
    color: var(--radar-green);
}
</style>