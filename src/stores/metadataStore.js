import { defineStore } from 'pinia'
import { metadataColumns } from '@/constants/metadataColumns'
import * as metadataService from '@/services/Archives/metadataService'

export const useMetadataStore = defineStore('metadata', {

    state: () => ({

        metadata: [],
        loading: false,
        totalRecords: 0,
        columns: metadataColumns,
        selectedColumns: metadataColumns.filter(c => c.visible),

        filters: {},

        pagination: {
            page: 1,
            rows: 100,
        },

        sort: {
            field: 'fecha_emision',
            order: -1,
        },
    }),

    actions: {

        async fetchMetadata(){},
        setFilters(){},
        clearFilters(){},
        setColumns(){},
        setPagination(){},
        setSorting(){},
        async exportToExcel(){},
    }

})