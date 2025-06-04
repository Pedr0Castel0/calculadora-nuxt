<template>
  <div class="dynamic-table space-y-4">
    <!-- Tabela Desktop -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full border border-slate-200 rounded-lg overflow-hidden">
        <thead class="bg-slate-50">
          <tr>
            <th
              v-for="column in table?.columns"
              :key="column.key"
              class="px-4 py-3 text-left text-sm font-semibold text-slate-700 border-b border-slate-200"
            >
              {{ column.label }}
              <span
                v-if="column.unit"
                class="text-xs font-normal opacity-75 ml-1"
              >
                ({{ column.unit }})
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in table?.data"
            :key="index"
            class="hover:bg-slate-50 transition-colors"
          >
            <td
              v-for="column in table?.columns"
              :key="column.key"
              class="px-4 py-3 text-sm text-slate-700 border-b border-slate-100"
              :class="{ 'cursor-pointer hover:bg-blue-50': column.copyable }"
              @click="
                column.copyable
                  ? copyToClipboard(formatValue(row[column.key], column))
                  : null
              "
            >
              <span v-if="column.type === 'text'">{{ row[column.key] }}</span>
              <span v-else>{{ formatValue(row[column.key], column) }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cards Mobile -->
    <div class="md:hidden space-y-3">
      <div
        v-for="(row, index) in table?.data"
        :key="index"
        class="bg-white border border-slate-200 rounded-lg p-4"
      >
        <div class="grid grid-cols-1 gap-2">
          <div
            v-for="column in table?.columns"
            :key="column.key"
            class="flex justify-between items-center"
            :class="{
              'cursor-pointer hover:bg-blue-50 rounded px-2 py-1':
                column.copyable,
            }"
            @click="
              column.copyable
                ? copyToClipboard(formatValue(row[column.key], column))
                : null
            "
          >
            <span class="text-sm font-medium text-slate-600">
              {{ column.label }}
              <span v-if="column.unit" class="text-xs font-normal opacity-75">
                ({{ column.unit }})
              </span>
            </span>
            <span class="text-sm text-slate-800 font-medium">
              {{
                column.type === "number"
                  ? formatValue(row[column.key], column)
                  : row[column.key]
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TableColumn {
  key: string;
  label: string;
  type: "number" | "text";
  unit?: string;
  copyable?: boolean;
}

interface TechnicalTable {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  hasUnitSwitcher: boolean;
  data: Record<string, any>[];
  columns: TableColumn[];
}

interface Props {
  table: TechnicalTable | null;
}

defineProps<Props>();
const emit = defineEmits<{
  copyValue: [];
}>();

const copyToClipboard = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
    emit("copyValue");
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = value;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    emit("copyValue");
  }
};

const formatValue = (value: any, column: TableColumn): string => {
  if (column.type === "number" && typeof value === "number") {
    if (value < 1) {
      return value.toFixed(4);
    } else if (value < 10) {
      return value.toFixed(3);
    } else if (value < 100) {
      return value.toFixed(2);
    } else {
      return value.toFixed(1);
    }
  }
  return String(value);
};
</script>
