<script lang="ts">
import axios from 'axios';
import ListItem from './ListItem.vue';

export default {
    name: "List",
    data() {
        return {
            violations: [] as string[][]
        }
    },
    computed: {
        sortedViolations() {
            const violationsList = this.violations;
            violationsList.sort((a: string[], b: string[]) => Date.parse(b[1]) - Date.parse(a[1]));
            return violationsList;
        }
    },
    created() {
        setInterval(async () => {
            const axiosResponse = await axios.get("http://localhost:3000/api/violations");
            const violationsList = axiosResponse.data;
            this.violations = violationsList;
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
                    :date="violation[1]" 
                    :serial-num="violation[0]" 
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
    height: 700px;
    overflow-y: scroll;
    width: 500px;
    padding: 0 1.5rem 0 1.5rem;
}

.violations-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    list-style: none;
    padding: 0;
}
</style>
