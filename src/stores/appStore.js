import { defineStore } from 'pinia'
import * as archivesService from '@/services/Archives/archivesService'
import * as metadataService from '@/services/Archives/metadataService'

export const useAppStore = defineStore('app', {
    
    state: () => ({

        loading: {
            archives: false,
            metadata: false
        },
        archivesProcessed: [],
        metadata: [],
    }),

    actions: {

        setLoading(value) {

            this.loading = value
        },
        async refreshArchives() {
            try {
                this.loading.archives = true

                const response = await archivesService.getArchivesByUser()
                this.archivesProcessed = Array.isArray(response)
                    ? response
                    : (response?.data || [])
            } catch (error) {
                console.error(error)
            } finally {
                this.loading.archives = false
            }
        },
        async consultMetadata(params) {
            try {
                this.loading.metadata = false
                
                const response = await metadataService.getMetadataByUser(params)
                this.metadata = Array.isArray(response)
                    ? response
                    : (response?.data || [])
            } catch (error) {
                console.error(error)
            } finally {
                this.loading.metadata = false
            }
        },
    },
})