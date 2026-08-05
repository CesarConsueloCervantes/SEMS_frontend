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
  const filterOptions = ref({
    rfc_emisor: [],
    nombre_emisor: [],
    rfc_receptor: [],
    nombre_receptor: [],
    pac_certifico: [],
    efecto_comprobante: [],
  })

  const pagination = reactive({ page: 1, rows: 100, })
  const sort =  reactive({ field: 'fecha_emision', order: -1 })

  const selectedColumns = computed(() =>
      columns.value.filter(column => column.visible)
  )

  const selectedFilters = computed(() =>
      columns.value.filter(column => column.visible)
                  .filter(column => column.filter)
  )

  function changeVisibleColumn(field){
    const column = columns.value.find(a => a.field === field)
    if(!column) return
    column.visible = !column.visible
  }

  function updateFilterValues(field, value = []){
    const column = columns.value.find(a => a.field === field)
    if(!column) return
    column.filter.value = value
  }

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
            selectedFilters.value.map(column => [
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

  async function refreshFilterOptions() {
    try {
      const data = await metadataService.getFiltersOptions()

      filterOptions.value = data.options
    } catch (error) {
      console.error(error)
    }
  }
  
  return {
    columns,
    selectedColumns,
    loading,
    count,
    pagination,
    sort,
    filterOptions,
    fetchMetadata,
    refreshFilterOptions,
    changeVisibleColumn,
    updateFilterValues
  }
})