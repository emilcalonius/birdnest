<script lang="ts">
import axios from 'axios';

export default {
    name: "List",
    data() {
        return {
            violations: [] as string[][]
        }
    },
    mounted() {
        setInterval(async () => {
            const axiosResponse = await axios.get("http://localhost:3000/api/violations");
            this.violations = axiosResponse.data as string[][];
        }, 2000);
    }
}
</script>

<template>
    <div class="list-container">
        <ul class="violations-list">
            <li v-for="violation in violations" class="item">
                <div class="side"></div>
                <div class="time">
                    <h5>Time</h5>
                    <p>{{ `${new Date(violation[1]).getHours()}:${new Date(violation[1]).getMinutes()}` }}</p>
                </div>
                <div class="drone">
                    <h5>Drone serial num.</h5>
                    <p>{{ `${violation[0]}` }}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.list-container {
    height: 80vh;
    overflow-y: scroll;
    width: 30rem;
}

.violations-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    list-style: none;
}

.item {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
    background-color: hsl(235, 16%, 15%);
    border: 2px solid black;
    border-radius: 5px;
    width: 25rem;
    height: 7rem;
}

.side {
    background-color: hsl(0, 43%, 53%);
    width: 1rem;
    height: 100%;
    border-radius: 5px 0px 0px 5px;
}

.time, .drone {
    padding: 0.5rem 2rem 0.5rem 2rem;
}

@media (hover: hover) {
    .item:hover {
        transform: scale(105%);
        cursor: pointer;
    }
}
</style>
