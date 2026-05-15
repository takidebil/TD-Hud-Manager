<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import BaseButton from './BaseButton.vue';

const props = withDefaults(defineProps<{
  headers: { key: string; label: string; sortable?: boolean }[];
  items: any[];
  isLoading?: boolean;
  selectable?: boolean;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  defaultPageSize?: number;
  searchPlaceholder?: string;
  searchable?: boolean;
}>(), {
  isLoading: false,
  selectable: false,
  sortDir: 'asc',
  defaultPageSize: 10,
  searchPlaceholder: 'Search...',
  searchable: true
});

const emit = defineEmits<{
  (e: 'edit', item: any): void;
  (e: 'delete', id: string): void;
  (e: 'sort', payload: { key: string; dir: 'asc' | 'desc' }): void;
  (e: 'selection-change', ids: string[]): void;
}>();

// --- SEARCH ---
const searchQuery = ref('');

const filteredItems = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return props.items;
  const keys = props.headers.map(h => h.key);
  return props.items.filter(item =>
    keys.some(key => {
      const val = item[key];
      return val != null && String(val).toLowerCase().includes(q);
    })
  );
});

// --- PAGINATION ---
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const pageSize = ref(props.defaultPageSize);
const currentPage = ref(1);

const totalPages = computed(() => Math.max(1, Math.ceil(filteredItems.value.length / pageSize.value)));

const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredItems.value.slice(start, start + pageSize.value);
});

// Visible page numbers — show up to 5 around current
const visiblePages = computed(() => {
  const total = totalPages.value;
  const cur = currentPage.value;
  const delta = 2;
  const pages: (number | '…')[] = [];
  const lo = Math.max(1, cur - delta);
  const hi = Math.min(total, cur + delta);
  if (lo > 1) { pages.push(1); if (lo > 2) pages.push('…'); }
  for (let i = lo; i <= hi; i++) pages.push(i);
  if (hi < total) { if (hi < total - 1) pages.push('…'); pages.push(total); }
  return pages;
});

// Reset to page 1 when items list, filter, or page size changes
watch(() => props.items.length, () => { currentPage.value = 1; });
watch(pageSize, () => { currentPage.value = 1; });
watch(searchQuery, () => { currentPage.value = 1; });

// --- SELECTION ---
const selectedIds = ref<string[]>([]);

watch(() => props.items, () => {
  selectedIds.value = [];
  emit('selection-change', []);
});

const allSelected = computed(() =>
  filteredItems.value.length > 0 && filteredItems.value.every(i => selectedIds.value.includes(i._id || i.id))
);

const someSelected = computed(() => {
  const filtered = filteredItems.value;
  const count = filtered.filter(i => selectedIds.value.includes(i._id || i.id)).length;
  return count > 0 && count < filtered.length;
});

const toggleSelectAll = () => {
  const filteredIds = filteredItems.value.map(i => i._id || i.id);
  if (allSelected.value) {
    selectedIds.value = selectedIds.value.filter(id => !filteredIds.includes(id));
  } else {
    const merged = new Set([...selectedIds.value, ...filteredIds]);
    selectedIds.value = [...merged];
  }
  emit('selection-change', [...selectedIds.value]);
};

const toggleSelectItem = (id: string) => {
  const idx = selectedIds.value.indexOf(id);
  if (idx === -1) selectedIds.value.push(id);
  else selectedIds.value.splice(idx, 1);
  emit('selection-change', [...selectedIds.value]);
};

const isSelected = (id: string) => selectedIds.value.includes(id);

// --- SORT ---
const handleSort = (header: { key: string; sortable?: boolean }) => {
  if (!header.sortable) return;
  const newDir = props.sortKey === header.key && props.sortDir === 'asc' ? 'desc' : 'asc';
  emit('sort', { key: header.key, dir: newDir });
};
</script>

<template>
  <div class="bg-black border border-zinc-800 overflow-hidden">
    <!-- Search bar -->
    <div v-if="searchable" class="px-4 py-2 border-b border-zinc-800 bg-zinc-950">
      <div class="relative flex items-center gap-2">
        <span class="text-primary font-bold text-xs uppercase">Search_></span>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="searchPlaceholder"
          class="flex-1 bg-transparent text-white placeholder-zinc-700 py-1 text-sm focus:outline-none"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="text-zinc-500 hover:text-red-500 transition-none"
        >
          [X]
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="p-12 text-center text-primary animate-pulse font-bold uppercase">
      >> LOADING_SYSTEM_DATA...
    </div>

    <div v-else-if="filteredItems.length === 0" class="p-12 text-center text-zinc-500 font-bold uppercase">
      <span v-if="searchQuery">!! NO_RESULTS_FOR: "{{ searchQuery }}"</span>
      <span v-else>!! NO_RECORDS_FOUND</span>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-zinc-900 border-b border-zinc-800">
            <!-- Checkbox column -->
            <th v-if="selectable" class="px-4 py-3 w-10">
              <input
                type="checkbox"
                :checked="allSelected"
                :indeterminate="someSelected"
                @change="toggleSelectAll"
                class="size-4 border-zinc-700 bg-black accent-primary cursor-pointer"
              />
            </th>
            <th
              v-for="header in headers"
              :key="header.key"
              :class="[
                'px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500',
                header.sortable ? 'cursor-pointer select-none hover:text-primary transition-none' : ''
              ]"
              @click="handleSort(header)"
            >
              <span class="flex items-center gap-1">
                {{ header.label }}
                <!-- Sort indicator -->
                <span v-if="sortKey === header.key" class="text-primary">
                   {{ sortDir === 'asc' ? '↑' : '↓' }}
                </span>
              </span>
            </th>
            <th class="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-900">
          <tr
            v-for="item in pagedItems"
            :key="item._id"
            :class="[
              'transition-none group',
              selectable && isSelected(item._id || item.id)
                ? 'bg-primary/5 text-primary'
                : 'hover:bg-zinc-950'
            ]"
          >
            <!-- Checkbox cell -->
            <td v-if="selectable" class="px-4 py-3">
              <input
                type="checkbox"
                :checked="isSelected(item._id || item.id)"
                @change="toggleSelectItem(item._id || item.id)"
                class="size-4 border-zinc-700 bg-black accent-primary cursor-pointer"
              />
            </td>
            <td v-for="header in headers" :key="header.key" class="px-6 py-2 text-sm">
              <slot :name="`cell-${header.key}`" :item="item">
                {{ item[header.key] }}
              </slot>
            </td>

            <td class="px-6 py-2 text-right">
              <div class="flex items-center justify-end gap-2 opacity-30 group-hover:opacity-100">
                <slot name="row-actions" :item="item" />
                <button
                  @click="$emit('edit', item)"
                  class="text-xs font-bold text-zinc-500 hover:text-white uppercase"
                  >[EDIT]</button
                >
                <button
                  @click="$emit('delete', item._id || item.id)"
                  class="text-xs font-bold text-zinc-500 hover:text-red-500 uppercase"
                  >[DEL]</button
                >
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination footer -->
    <div v-if="!isLoading && filteredItems.length > 0" class="px-6 py-2 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-zinc-950">
      <!-- Left: rows per page + count -->
      <div class="flex items-center gap-3 text-[10px] font-bold uppercase text-zinc-500">
        <span>Page_Size:</span>
        <select
          v-model="pageSize"
          class="bg-black border border-zinc-800 text-primary px-1 py-0.5 focus:outline-none"
        >
          <option v-for="opt in PAGE_SIZE_OPTIONS" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>

      <!-- Right: page controls -->
      <div class="flex items-center gap-2">
        <button
          @click="currentPage = 1"
          :disabled="currentPage === 1"
          class="text-[10px] font-bold uppercase text-zinc-500 hover:text-primary disabled:opacity-20 transition-none"
        >
          [FIRST]
        </button>
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="text-[10px] font-bold uppercase text-zinc-500 hover:text-primary disabled:opacity-20 transition-none"
        >
          [PREV]
        </button>

        <span class="text-[10px] font-bold text-primary px-2">
          PAGE {{ currentPage }} OF {{ totalPages }}
        </span>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="text-[10px] font-bold uppercase text-zinc-500 hover:text-primary disabled:opacity-20 transition-none"
        >
          [NEXT]
        </button>
        <button
          @click="currentPage = totalPages"
          :disabled="currentPage === totalPages"
          class="text-[10px] font-bold uppercase text-zinc-500 hover:text-primary disabled:opacity-20 transition-none"
        >
          [LAST]
        </button>
      </div>
    </div>
  </div>
</template>