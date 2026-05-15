<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSettings } from '../../features/settings/composables/useSettings';
import BaseButton from './BaseButton.vue';
import BaseCheckbox from './BaseCheckbox.vue';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const { settings, isLoading, isSaving, fetchSettings } = useSettings();

watch(() => props.open, (val) => {
  if (val) fetchSettings();
});

// --- GSI Config Installation ---
const steamPath = ref('C:\\Program Files (x86)\\Steam');
const gsiStatus = ref<{ ok: boolean; message: string } | null>(null);
const isInstallingGsi = ref(false);

const browseSteamFolder = async () => {
  const selected = await window.electron.ipcRenderer.invoke('select-folder', steamPath.value);
  if (selected) {
    steamPath.value = selected;
    gsiStatus.value = null;
  }
};

const installGsiCfg = async () => {
  isInstallingGsi.value = true;
  gsiStatus.value = null;
  try {
    gsiStatus.value = await window.electron.ipcRenderer.invoke('install-gsi-cfg', steamPath.value);
  } finally {
    isInstallingGsi.value = false;
  }
};
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-end justify-start"
        @click.self="emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/80" @click="emit('close')" />

        <!-- Panel — anchored to bottom-left near the sidebar -->
        <div class="relative z-10 ml-4 mb-16 w-96 bg-black border-2 border-primary shadow-none p-5 flex flex-col gap-5">
          
          <div class="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h2 class="text-primary font-bold text-base uppercase tracking-tighter">:: Settings</h2>
            <BaseButton @click="emit('close')" variant="ghost" size="xs">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </BaseButton>
          </div>

          <div v-if="isLoading" class="text-primary text-sm text-center py-4 font-bold uppercase animate-pulse">>> LOADING_CONFIG…</div>

          <template v-else>
            <!-- Section: Match -->
            <div>
              <p class="text-[10px] font-bold uppercase text-zinc-500 bg-zinc-900/50 py-1 px-2 mb-3 tracking-widest border-l-2 border-zinc-700"># MATCH_AUTOMATION</p>

              <!-- Auto Switch Sides -->
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-bold text-white uppercase">AUTO_SWITCH_SIDES</p>
                  <p class="text-xs text-zinc-500 mt-0.5">Automatically flip team sides at halftime</p>
                </div>
                <BaseCheckbox v-model="settings.autoSwitchSides" :disabled="isSaving" size="md" class="text-primary" />
              </div>
            </div>

            <!-- Section: CS2 Integration -->
            <div class="border-t border-zinc-800 pt-4">
              <p class="text-[10px] font-bold uppercase text-zinc-500 bg-zinc-900/50 py-1 px-2 mb-3 tracking-widest border-l-2 border-zinc-700"># CS2_INTEGRATION</p>

              <div class="flex flex-col gap-2">
                <p class="text-sm font-bold text-white uppercase">INSTALL_GSI_CONFIG</p>
                <p class="text-xs text-zinc-500">Select your Steam root folder. The config file will be written to your CS2 cfg directory.</p>

                <!-- Path selector -->
                <div class="flex gap-2 mt-1">
                  <input
                    v-model="steamPath"
                    type="text"
                    placeholder="C:\Program Files (x86)\Steam"
                    class="flex-1 min-w-0 bg-black border border-zinc-700 text-white text-xs px-3 py-2 focus:outline-none focus:border-primary"
                  />
                  <BaseButton
                    @click="browseSteamFolder"
                    variant="secondary"
                    size="sm"
                  >
                    [ BROWSE ]
                  </BaseButton>
                </div>

                <BaseButton
                  @click="installGsiCfg"
                  :disabled="isInstallingGsi || !steamPath"
                  variant="primary"
                  class="flex-1 justify-center"
                >
                  {{ isInstallingGsi ? '> INSTALLING…' : '> INSTALL_GSI_CONFIG' }}
                </BaseButton>

                <!-- Status feedback -->
                <div
                  v-if="gsiStatus"
                  class="text-xs px-3 py-2 whitespace-pre-wrap border border-dashed"
                  :class="gsiStatus.ok ? 'bg-emerald-950/50 text-emerald-400 border-emerald-400' : 'bg-red-950/50 text-red-400 border-red-400'"
                >
                  >> {{ gsiStatus.message }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.1s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
