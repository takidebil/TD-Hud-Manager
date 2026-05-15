<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'amber' | 'zinc' | 'blue' | 'orange' | 'emerald' | 'red';
}>(), {
  variant: 'zinc',
});
</script>

<template>
  <span
    :class="[
      'text-[10px] px-1.5 py-0.5 uppercase font-bold border-l-2 transition-none',
      variant === 'amber'   && 'bg-amber-950 text-amber-400 border-amber-400',
      variant === 'zinc'    && 'bg-zinc-900 text-zinc-400 border-zinc-500',
      variant === 'blue'    && 'bg-blue-950 text-blue-400 border-blue-400',
      variant === 'orange'  && 'bg-orange-950 text-orange-400 border-orange-400',
      variant === 'emerald' && 'bg-emerald-950 text-emerald-400 border-emerald-400',
      variant === 'red'     && 'bg-red-950 text-red-400 border-red-400',
    ]"
  >
    <slot />
  </span>
</template>
