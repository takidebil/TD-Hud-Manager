<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue?: string | number;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'search' | 'url';
  disabled?: boolean;
  error?: string;
  hint?: string;
  size?: 'lg' | 'md' | 'sm';
}>(), {
  type: 'text',
  disabled: false,
  size: 'md',
});

defineEmits<{
  'update:modelValue': [value: string | number];
}>();
</script>

<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" class="block text-xs font-bold text-primary mb-1 uppercase">
      {{ label }}
    </label>

    <!-- Input -->
    <input
      :value="modelValue"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :class="[
        'w-full bg-black border text-white focus:outline-none transition-none',
        'placeholder:text-zinc-700',
        // Size
        size === 'lg' && 'px-4 py-2 text-base',
        size === 'md' && 'px-3 py-1 text-sm',
        size === 'sm' && 'px-2 py-1 text-xs',
        // Border color
        error ? 'border-red-500 focus:bg-red-950' : 'border-zinc-700 focus:border-primary',
        // Disabled
        disabled && 'opacity-30 cursor-not-allowed',
      ]"
    />

    <!-- Error message -->
    <p v-if="error" class="mt-1 text-xs text-red-500 font-bold uppercase">>> {{ error }}</p>

    <!-- Hint text -->
    <p v-else-if="hint" class="mt-1 text-xs text-zinc-500 font-bold lowercase">:: {{ hint }}</p>
  </div>
</template>
