import { defineStore } from 'pinia'
import * as archivesService from '@/services/Archives/archivesService'

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
        refreshMetadata(metadata) {
            this.metadata = metadata
        },
    },
})