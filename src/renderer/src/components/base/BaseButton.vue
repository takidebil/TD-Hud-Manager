<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'lg' | 'md' | 'sm' | 'xs';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}>(), {
  variant: 'secondary',
  size: 'md',
  disabled: false,
  type: 'button',
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'font-bold transition-none flex items-center gap-2 uppercase tracking-tighter',
      // Variant
      variant === 'primary'   && 'hover:cursor-pointer bg-primary text-black hover:bg-white',
      variant === 'secondary' && 'hover:cursor-pointer bg-transparent border border-white text-white hover:bg-white hover:text-black',
      variant === 'danger'    && 'hover:cursor-pointer bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-black',
      variant === 'ghost'     && 'hover:cursor-pointer text-zinc-500 hover:text-primary hover:bg-zinc-900',
      // Size
      size === 'lg' && 'px-6 py-2 text-lg',
      size === 'md' && 'px-4 py-1 text-sm',
      size === 'sm' && 'px-3 py-1 text-xs',
      size === 'xs' && 'px-2 py-0.5 text-xs',
      // Disabled
      disabled && 'opacity-30 cursor-not-allowed',
    ]"
  >
    <slot />
  </button>
</template>
