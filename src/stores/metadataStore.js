import { defineStore } from 'pinia'
import { computed, ref, reactive } from 'vue'
import { metadataColumns } from '@/constants/metadataColumns'
import * as metadataService from '@/services/Archives/metadataService'

export const useMetadataStore = defineStore('metadata', () => {

  const metadata = ref([])
  const columns = ref(structuredClone(metadataColumns))

  const isloading = ref(false)
  const count = ref(0)

  const pagination = reactive({ page: 1, rows: 100, })
  const sort =  reactive({ field: 'fecha_emision', order: -1 })

  const selectedColumns = computed(() =>
      columns.value.filter(column => column.visible)
  )

})