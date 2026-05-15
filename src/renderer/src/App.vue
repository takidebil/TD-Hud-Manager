<script setup lang="ts">
import BaseConfirmation from './components/base/BaseConfirmation.vue';
import TopNavBar from './components/TopNavBar.vue';
</script>

<template>
  <div class="flex flex-col h-screen bg-background text-text-main">
    <BaseConfirmation />
    <TopNavBar />
    <main class="flex-1 overflow-y-auto custom-scrollbar">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 12px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #0a0a0a;
  border-left: 1px solid #333;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #333;
  border: 2px solid #0a0a0a;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #00ff00;
}
</style>
