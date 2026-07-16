<template>
  <div class="file-tree">
    <div class="file-tree__topbar">
      <div class="file-tree__traffic-lights">
        <div class="file-tree__dot file-tree__dot--red" />
        <div class="file-tree__dot file-tree__dot--yellow" />
        <div class="file-tree__dot file-tree__dot--green" />
      </div>
      <span class="file-tree__root-label">project/</span>
    </div>
    <div class="file-tree__body">
      <div
        v-for="(item, i) in flatFileTree"
        :key="i"
        class="file-tree__item"
        :style="{ paddingLeft: item.depth * 16 + 'px' }"
      >
        <span :class="`file-tree__item-icon file-tree__item-icon--${item.type}`">
          {{ item.type === 'dir' ? '📂' : '📄' }}
        </span>
        <span :class="`file-tree__item-name file-tree__item-name--${item.type}`">
          {{ item.name }}
        </span>
        <span v-if="item.note" class="file-tree__item-note"># {{ item.note }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
export interface FileItem {
  type: 'dir' | 'file'
  name: string
  note?: string
  children?: FileItem[]
}

export interface FlatFileItem extends Omit<FileItem, 'children'> { depth: number }

const { data: fileTreeItem } = await useFetch<FileItem[]>('/api/fileTreeStructure', {
  method: 'GET',
});

// ── File tree flatten ────────────────────────────────────────────────────────
function flattenTree(items: FileItem[], depth = 0): FlatFileItem[] {
  return items.flatMap((item) => [
    { type: item.type, name: item.name, note: item.note, depth },
    ...(item.children ? flattenTree(item.children, depth + 1) : []),
  ])
}

const flatFileTree = computed(() => flattenTree(fileTreeItem.value ?? []))
</script>