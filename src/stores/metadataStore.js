import { defineStore } from 'pinia'
import { computed, ref, reactive } from 'vue'
import { metadataColumns } from '@/constants/metadataColumns'
import * as metadataService from '@/services/Archives/metadataService'
import { useAppStore } from '@/stores/appStore'

export const useMetadataStore = defineStore('metadata', () => {
  
  const appStore = useAppStore()
  const columns = ref(structuredClone(metadataColumns))

  const loading = ref(false)
  const count = ref(0)

  const pagination = reactive({ page: 1, rows: 100, })
  const sort =  reactive({ field: 'fecha_emision', order: -1 })

  const selectedColumns = computed(() =>
      columns.value.filter(column => column.visible)
  )

  async function fetchMetadata() {

    loading.value = true

    try {
      const query = {
        page: pagination.page,
        rows: pagination.rows,

        sortField: sort.field,
        sortOrder: sort.order,

        columns: JSON.stringify(
          selectedColumns.value.map(column => column.field)
        ),

        filters: JSON.stringify(
          Object.fromEntries(
            columns.value
              .filter(column => column.filter)
              .map(column => [
                  column.field,
                  column.filter,
              ])
          )
        ),
      }

      const response = await metadataService.getMetadataByUser(query)

      appStore.refreshMetadata(
        Array.isArray(response)
          ? response  
          : (response?.data ?? [])  
      )
      count.value = response.count ?? 0
    }
    catch (error) {
      console.error(error)
    }
    finally {
      loading.value = false
    }
  }
  
  return {
    columns,
    selectedColumns,
    loading,
    count,
    pagination,
    sort,
    fetchMetadata,
  }
})