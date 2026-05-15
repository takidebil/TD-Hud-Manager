<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { socket } from '../socket';
import SettingsModal from './base/SettingsModal.vue';
import TopNavLink from './TopNavLink.vue';
import BaseButton from './base/BaseButton.vue';

const settingsOpen = ref(false);
const hasLiveData = ref(false);
const updateAvailable = ref<string | null>(null);
let liveDataTimeout: ReturnType<typeof setTimeout> | null = null;

const onUpdate = () => {
  hasLiveData.value = true;
  if (liveDataTimeout) clearTimeout(liveDataTimeout);
  liveDataTimeout = setTimeout(() => { hasLiveData.value = false; }, 5000);
};

onMounted(() => {
  socket.on('update', onUpdate)
  window.api.onUpdateAvailable((version) => {
    updateAvailable.value = version
  })
});
onUnmounted(() => {
  socket.off('update', onUpdate);
  if (liveDataTimeout) clearTimeout(liveDataTimeout);
});

function openReleasesPage() {
  window.api.openExternal('https://github.com/takidebil/TD-Hud-Manager/releases/latest')
}

function openGithub() {
  window.api.openExternal('https://github.com/takidebil/TD-Hud-Manager')
}
</script>

<template>
  <SettingsModal :open="settingsOpen" @close="settingsOpen = false" />

  <nav class="bg-black border-b border-zinc-800 flex items-center justify-between px-4 py-2 shrink-0">
    <!-- Logo -->
    <div class="flex items-center gap-2 font-bold tracking-tighter">
      <span class="text-2xl">
        <span class="text-white">TD</span><span class="text-primary">_HUD</span>
      </span>
    </div>

    <!-- Nav Links -->
    <div class="flex items-center gap-4">
      <TopNavLink to="/huds" label="HUDs" />
      <TopNavLink to="/players" label="Players" />
      <TopNavLink to="/teams" label="Teams" />
      <TopNavLink to="/matches" label="Matches" />
      <div class="border-r border-dashed border-zinc-800 h-6"></div>
      <TopNavLink to="/live" label="Live Game Data" :badge="hasLiveData" />
      <TopNavLink to="/spectator" label="Spectator Binds" />
    </div>

    <!-- Right section: Settings, GitHub, Update -->
    <div class="flex items-center gap-2">
      <button
        v-if="updateAvailable"
        @click="openReleasesPage"
        class="hover:cursor-pointer relative text-amber-400 hover:text-amber-300 transition-none"
        :title="`Update ${updateAvailable} available — click to download`"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 -960 960 960" fill="currentColor"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>
        <span class="absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber-400 animate-pulse"></span>
      </button>
      <BaseButton @click="settingsOpen = true" variant="ghost" size="sm" title="Settings">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </BaseButton>
      <BaseButton @click="openGithub" variant="ghost" size="sm" title="GitHub">
        <svg class="size-4" viewBox="0 0 98 96" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_730_27126)">
            <path d="M41.4395 69.3848C28.8066 67.8535 19.9062 58.7617 19.9062 46.9902C19.9062 42.2051 21.6289 37.0371 24.5 33.5918C23.2559 30.4336 23.4473 23.7344 24.8828 20.959C28.7109 20.4805 33.8789 22.4902 36.9414 25.2656C40.5781 24.1172 44.4062 23.543 49.0957 23.543C53.7852 23.543 57.6133 24.1172 61.0586 25.1699C64.0254 22.4902 69.2891 20.4805 73.1172 20.959C74.457 23.543 74.6484 30.2422 73.4043 33.4961C76.4668 37.1328 78.0937 42.0137 78.0937 46.9902C78.0937 58.7617 69.1934 67.6621 56.3691 69.2891C59.623 71.3945 61.8242 75.9883 61.8242 81.252L61.8242 91.2051C61.8242 94.0762 64.2168 95.7031 67.0879 94.5547C84.4102 87.9512 98 70.6289 98 49.1914C98 22.1074 75.9883 6.69539e-07 48.9043 4.309e-07C21.8203 1.92261e-07 -1.9479e-07 22.1074 -4.3343e-07 49.1914C-6.20631e-07 70.4375 13.4941 88.0469 31.6777 94.6504C34.2617 95.6074 36.75 93.8848 36.75 91.3008L36.75 83.6445C35.4102 84.2188 33.6875 84.6016 32.1562 84.6016C25.8398 84.6016 22.1074 81.1563 19.4277 74.7441C18.375 72.1602 17.2266 70.6289 15.0254 70.3418C13.877 70.2461 13.4941 69.7676 13.4941 69.1934C13.4941 68.0449 15.4082 67.1836 17.3223 67.1836C20.0977 67.1836 22.4902 68.9063 24.9785 72.4473C26.8926 75.2227 28.9023 76.4668 31.2949 76.4668C33.6875 76.4668 35.2187 75.6055 37.4199 73.4043C39.0469 71.7773 40.291 70.3418 41.4395 69.3848Z" fill="currentColor"/>
          </g>
          <defs>
            <clipPath id="clip0_730_27126">
              <rect width="98" height="96" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </BaseButton>
    </div>
  </nav>
</template>
