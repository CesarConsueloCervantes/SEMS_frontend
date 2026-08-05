import api from '@/config/axios'

/**
 * Retrieves filtered and ordered metadata listing for a specific user ID.
 * @param {*} params 
 * @returns 
 */
export async function getMetadataByUser(params = {}) {

    const { data } = await api.get(
        `/metadata`,
        { params }
    )
    
    return data
}

export async function getFiltersOptions() {

    const { data } = await api.get(
        `/metadata/options`
    )
    
    return data
}