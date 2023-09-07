<template>
    <div>
        <h1>BASED</h1>
        <ul>
            <li v-for="user in users" :key="user.id">
                {{ user.email }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
const { data:users } = await useFetch('/api/users/')
</script>

<style scoped>

</style>