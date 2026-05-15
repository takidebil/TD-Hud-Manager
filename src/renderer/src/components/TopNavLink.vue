<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{
  to: string;
  label: string;
  badge?: boolean;
}>();

const route = useRoute();

const isActive = computed(() => {
  return route.path === props.to;
});
</script>

<template>
  <router-link
    :to="to"
    class="flex items-center text-xs font-bold uppercase text-zinc-500 transition-none hover:text-white hover:bg-zinc-900 px-3 py-2"
    active-class="text-primary! bg-zinc-900 border-b-2 border-primary"
    :title="label"
  >
    <div class="relative flex items-center justify-center w-5 h-5 shrink-0" :class="isActive && '[&>svg]:fill-primary'">
      <slot />
      <span v-if="badge" class="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 animate-pulse"></span>
    </div>
    <span class="tracking-tight ml-2">{{ label }}</span>
  </router-link>
</template>
