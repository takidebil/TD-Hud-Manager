<script setup lang="ts">
import BaseButton from './BaseButton.vue';

defineProps<{
  isOpen: boolean;
  title: string;
  formId?: string; // ID of the form inside the slot to trigger submit
  maxWidthClass?: string;
}>();

defineEmits(['close', 'cancel']);
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
    <div :class="['bg-black border-2 border-primary w-full shadow-none overflow-hidden flex flex-col max-h-[90vh]', maxWidthClass || 'max-w-md']">

      <div class="p-4 border-b border-primary flex justify-between items-center bg-primary/10">
        <h2 class="text-lg font-bold text-primary uppercase tracking-tighter">:: {{ title }}</h2>
        <BaseButton @click="$emit('close')" variant="ghost" size="xs">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </BaseButton>
      </div>

      <div class="overflow-y-auto flex-1 custom-scrollbar p-6">
        <slot></slot>
      </div>

      <div class="p-4 border-t border-zinc-800 bg-black flex gap-2">
        <BaseButton 
          @click="$emit('cancel')" 
          class="flex-1 justify-center"
          size="md"
        >
          [ CANCEL ]
        </BaseButton>
        <BaseButton 
          :form="formId"
          type="submit" 
          variant="primary"
          class="flex-1 justify-center"
          size="md"
        >
          [ SAVE_CHANGES ]
        </BaseButton>
      </div>

    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #000; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
</style>