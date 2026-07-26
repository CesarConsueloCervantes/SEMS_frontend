import api from '@/config/axios'

/**
 * Fetches all processed archives associated with a specific user ID, ordered alphabetically.
 */
export async function getArchivesByUser() {

    const { data } = await api.get(
        `/archives-prossesed`
    )
    
    return data
}

/**
 * Retrieves detailed information about a single processed archive by its unique ID.
 */
export async function getArchive(archiveId) {

    const { data } = await api.get(
        `/archives-prossesed/${archiveId}`
    )
    
    return data
}

/**
 * Uploads and registers a new archive to the system with its validation payload.
 */
export async function storeArchive(archiveData) {

    const { data } = await api.post(
        '/archives-prossesed',
        archiveData
    )
    
    return data
}

/**
 * Updates the metadata properties (such as filename) of an existing archive by its ID.
 */
export async function updateArchive(archiveId, updateData) {

    const { data } = await api.put(
        `/archives-prossesed/${archiveId}`,
        updateData
    )
    
    return data
}

/**
 * Permanently removes a processed archive, its database record, and its physical files by ID.
 */
export async function deleteArchive(archiveId) {

    const { data } = await api.delete(
        `/archives-prossesed/${archiveId}`
    )
    
    return data
}

/**
 * Verifies if an archive's cryptographic hash or name already exists in the system records.
 */
export async function validateArchive(queryData) {

    const { data } = await api.post(
        '/consult_archive_info',
        queryData
    )
    
    return data
}