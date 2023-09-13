<template>
    <div>
       <!--  <h1 class="bg-slate-500">BASED</h1> -->
        {{ fetch }}
    </div>
</template>

<script setup lang="ts">
    const fetch = await useFetch('/api/chairs/')
</script>

<style scoped>

</style>