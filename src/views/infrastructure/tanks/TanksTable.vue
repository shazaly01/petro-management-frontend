<!--src\views\infrastructure\tanks\TanksTable.vue--->
<template>
  <AppTable :headers="headers" :items="items" :is-loading="loading" :row-clickable="false">
    <template #cell-fuel_type="{ item }">
      <span class="font-medium text-primary">
        {{ item.fuel_type?.name || '-' }}
      </span>
    </template>

    <template #cell-stock_level="{ item }">
      <div class="w-full max-w-xs py-1">
        <!-- الرأس: شارة الحالة، كمية المخزون والسعة، والنسبة المئوية -->
        <div class="flex items-center justify-between mb-1.5 text-xs">
          <div class="flex items-center gap-2">
            <!-- شارة حالة المخزون (Badge) -->
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-all"
              :class="getStockStatus(item).badgeClass"
            >
              <span
                class="w-1.5 h-1.5 rounded-full animate-pulse"
                :class="getStockStatus(item).dotClass"
              ></span>
              {{ getStockStatus(item).label }}
            </span>

            <!-- أرقام المخزون والسعة -->
            <span class="font-medium text-text-secondary">
              <strong :class="getStockStatus(item).textClass">{{
                formatLiters(item.current_stock)
              }}</strong>
              <span class="text-text-muted mx-1">/</span>
              <span>{{ formatLiters(item.capacity) }}</span>
            </span>
          </div>

          <!-- النسبة المئوية -->
          <span class="font-bold text-xs" :class="getStockStatus(item).textClass">
            {{ calculatePercentage(item) }}%
          </span>
        </div>

        <!-- شريط التقدم المجسم المطور -->
        <div
          class="relative w-full bg-gray-200 dark:bg-surface-section rounded-full h-2.5 overflow-hidden p-0.5 border border-gray-300/30 dark:border-surface-border shadow-inner"
        >
          <!-- شريط الامتلاء الملون مع تدرج لوني سلس -->
          <div
            class="h-full rounded-full transition-all duration-500 ease-out shadow-sm"
            :class="getStockStatus(item).gradientClass"
            :style="{ width: Math.min(calculatePercentage(item), 100) + '%' }"
          ></div>

          <!-- مؤشر حد التنبيه (Threshold Marker) -->
          <div
            v-if="item.alert_threshold && item.capacity"
            class="absolute top-0 bottom-0 w-0.5 bg-danger/80 z-10 pointer-events-none"
            :style="{ right: getThresholdPercentage(item) + '%' }"
            :title="`حد التنبيه: ${formatLiters(item.alert_threshold)}`"
          ></div>
        </div>
      </div>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center justify-end gap-2">
        <button
          @click="$emit('edit', item)"
          class="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400"
          title="تعديل"
        >
          <PencilSquareIcon class="h-5 w-5" />
        </button>
        <button
          @click="$emit('delete', item)"
          class="p-1 text-red-600 hover:text-red-800 dark:text-red-400"
          title="حذف"
        >
          <TrashIcon class="h-5 w-5" />
        </button>
      </div>
    </template>
  </AppTable>
</template>

<script setup>
import { computed } from 'vue'
import AppTable from '@/components/ui/AppTable.vue'
import { PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { formatNumber } from '@/utils/formatters'

defineProps({
  items: Array,
  loading: Boolean,
})

defineEmits(['edit', 'delete'])

const headers = computed(() => [
  { key: 'code', label: 'كود الخزان', class: 'text-right w-32' },
  { key: 'name', label: 'الاسم', class: 'text-right' },
  { key: 'fuel_type', label: 'نوع الوقود', class: 'text-right' },
  { key: 'stock_level', label: 'مستوى المخزون', class: 'text-right w-72' },
  { key: 'actions', label: '', class: 'w-20' },
])

const calculatePercentage = (item) => {
  if (!item?.capacity || item.capacity <= 0) return 0
  return Math.min(Math.round((item.current_stock / item.capacity) * 100), 100)
}

const getThresholdPercentage = (item) => {
  if (!item?.capacity || !item?.alert_threshold) return 0
  return Math.min(Math.round((item.alert_threshold / item.capacity) * 100), 100)
}

const getStockStatus = (item) => {
  const percentage = calculatePercentage(item)
  const isAlert = item.current_stock <= item.alert_threshold

  if (isAlert) {
    return {
      label: 'حرج',
      textClass: 'text-danger font-bold',
      badgeClass: 'bg-red-500/10 text-danger border-red-500/20 dark:bg-red-500/20',
      dotClass: 'bg-danger',
      gradientClass: 'bg-gradient-to-r from-red-600 to-danger',
    }
  }

  if (percentage < 30) {
    return {
      label: 'منخفض',
      textClass: 'text-warning font-semibold',
      badgeClass: 'bg-orange-500/10 text-warning border-orange-500/20 dark:bg-orange-500/20',
      dotClass: 'bg-warning',
      gradientClass: 'bg-gradient-to-r from-amber-500 to-warning',
    }
  }

  return {
    label: 'طبيعي',
    textClass: 'text-success font-semibold',
    badgeClass: 'bg-green-500/10 text-success border-green-500/20 dark:bg-green-500/20',
    dotClass: 'bg-success',
    gradientClass: 'bg-gradient-to-r from-emerald-500 to-success',
  }
}

const formatLiters = (val) => {
  return `${formatNumber(val || 0)} لتر`
}
</script>
