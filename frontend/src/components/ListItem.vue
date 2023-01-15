<script lang="ts">

export default {
    name: "ListItem",
    props: {
        date: String,
        serialNum: String
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
        }
    }
}
</script>

<template>
    <li class="list-item">
        <div class="side"></div>
        <div class="time">
            <h5>Time</h5>
            <p>{{ formattedTime }}</p>
        </div>
        <div class="drone">
            <h5>Drone serial num.</h5>
            <p>{{ serialNum }}</p>
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
    .list-item:hover {
        transform: scale(105%);
        cursor: pointer;
    }
}
</style>