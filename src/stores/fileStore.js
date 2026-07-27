import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { FILE_VALIDATION, FILE_VALIDATION_MESSAGES } from '@/constants/fileValidation'
import * as archivesService from '@/services/Archives/archivesService'

export const ArchiveUploadStatus = {
  WAITING: 'waiting',
  VALIDATING_STRUCTURE: 'validating_structure',
  INVALID_STRUCTURE: 'invalid_structure',
  HASHING: 'hashing',
  VALIDATING_API: 'validating_api',
  DUPLICATED: 'duplicated',
  READY_TO_UPLOAD: 'ready_to_upload',
  UPLOADING: 'uploading',
  COMPLETED: 'completed',
  ERROR: 'error'
}

const queue = []
const workersRunning = ref(false)

function createArchive(file) {
  return {
    id: crypto.randomUUID(),
    file,
    name: file.name,
    extension: file.name.split('.').pop()?.toLowerCase() ?? '',
    size: file.size,
    hash: null,
    status: ArchiveUploadStatus.WAITING,
    progress: 0,
    processCanceled: false,
    message: '',
  }
}

export const useArchivesUploadStore = defineStore('archivesUpload', () => {

  /*
   * ==========================================================
   * STATE
   * ==========================================================
   */

  const archives = ref([])
  const isUploading = ref(false)

  /*
   * ==========================================================
   * GETTERS
   * ==========================================================
   */

  const totalArchives = computed(() => archives.value.length)
  const completedArchives = computed(() => {
    return archives.value.filter(a =>
      a.status === ArchiveUploadStatus.COMPLETED
    ).length
  })

  const progress = computed(() => {
    if (!archives.value.length) return 0
    return completedArchives.value
  })

  const hasPendingArchives = computed(() => {
    return archives.value.some(a => [
      ArchiveUploadStatus.WAITING,
      ArchiveUploadStatus.VALIDATING_STRUCTURE,
      ArchiveUploadStatus.HASHING,
      ArchiveUploadStatus.VALIDATING_API,
      ArchiveUploadStatus.READY_TO_UPLOAD,
      ArchiveUploadStatus.UPLOADING,
      ArchiveUploadStatus.PROCESSING
    ].includes(a.status))
  })

  /*
   * ==========================================================
   * Helpers
   * ==========================================================
   */

  async function processArchive(id) {
    if (!await validateMetadataStructure(id)) {
      releaseArchive(id)
      return
    }

    if (isCanceled(id)) return

    if (!await calculateHash(id)) {
      releaseArchive(id)
      return
    }

    if (isCanceled(id)) return

    if (!await validateArchive(id)) {
      releaseArchive(id)
      return
    }

    if (isCanceled(id)) return
  }


  /*
   * ==========================================================
   * ACTIONS
   * ==========================================================
   */

  function addArchives(files) {
    const newArchives = files.map(createArchive)

    archives.value.push(...newArchives)

    queue.push(...newArchives)

    startWorkers()
  }

  async function startWorkers() {
    if (workersRunning.value) return

    workersRunning.value = true

    await Promise.all(
      Array.from({ length: 5 }, worker)
    )

    workersRunning.value = false
  }

  async function worker() {
    while (queue.length > 0) {
      const archive = queue.shift()

      if (!archive) break

      await processArchive(archive.id)
    }
  }

  function removeArchive(id) {
    archives.value = archives.value.filter(a => a.id !== id)
  }

  function clearArchives() {
    archives.value = []
  }

  function updateStatus(id, status, message = '') {
    const archive = archives.value.find(a => a.id === id)
    if (!archive) return
    archive.status = status
    archive.message = message
  }

  function updateHash(id, hash) {
    const archive = archives.value.find(a => a.id === id)
    if (!archive) return
    archive.hash = hash
  }

  function updateProgress(id, value) {
    const archive = archives.value.find(a => a.id === id)
    if (!archive) return
    archive.progress = value
  }

  function releaseArchive(id) {
    const archive = archives.value.find(a => a.id === id)
    if (!archive) return
    archive.file = null
  }

  function releaseAllFiles() {
    archives.value.forEach(archive => {
      archive.file = null
    })
  }

  async function uploadReadyArchives() {
    const tasks = archives.value
      .filter(a => a.status === ArchiveUploadStatus.READY_TO_UPLOAD)
      .map(a => uploadArchive(a.id))

    await Promise.all(tasks)
  }

  function isCanceled(id) {
    const archive = archives.value.find(a => a.id === id)

    return !archive || archive.processCanceled
  }

  function cancelArchive(id) {
    const archive = archives.value.find(a => a.id === id)

    if (!archive) return

    if (
        archive.status === ArchiveUploadStatus.UPLOADING ||
        archive.status === ArchiveUploadStatus.COMPLETED
    ) {
        return
    }

    archive.processCanceled = true

    releaseArchive(id)
  }


  /*
   * ==========================================================
   * PROCESS PIPELINE
   * ==========================================================
   */

  /**
   * Validates the extension, size, and header structure of a single archive file directly within this method.
   */
  async function validateMetadataStructure(id) {
    const archive = archives.value.find(a => a.id === id)

    if (!archive)
      return false

    if (!archive.file) {
      updateStatus(archive.id, ArchiveUploadStatus.INVALID_STRUCTURE, FILE_VALIDATION_MESSAGES.INVALID_STRUCTURE)
      return false
    }

    updateStatus(archive.id, ArchiveUploadStatus.VALIDATING_STRUCTURE)

    /*
    * Validate extension
    */
    const extension = `.${archive.extension}`

    if (!FILE_VALIDATION.ALLOWED_EXTENSIONS.includes(extension)) {
      updateStatus(archive.id, ArchiveUploadStatus.INVALID_STRUCTURE, FILE_VALIDATION_MESSAGES.INVALID_EXTENSION)
      return false
    }

    /*
    * Validate size
    */
    if (archive.size < FILE_VALIDATION.MIN_SIZE || archive.size > FILE_VALIDATION.MAX_SIZE) {
      updateStatus(archive.id, ArchiveUploadStatus.INVALID_STRUCTURE, FILE_VALIDATION_MESSAGES.INVALID_SIZE)
      return false
    }

    /*
    * Read complete file
    */
    let text = ''

    try {
      text = await archive.file.text()
    } catch {
      updateStatus(archive.id, ArchiveUploadStatus.INVALID_STRUCTURE, FILE_VALIDATION_MESSAGES.INVALID_STRUCTURE)
      return false
    }

    const lines = text
      .split(/\r?\n/)
      .filter(line => line.trim().length > 0)

    if (!lines.length) {
      updateStatus(archive.id, ArchiveUploadStatus.INVALID_STRUCTURE, FILE_VALIDATION_MESSAGES.INVALID_STRUCTURE)
      return false
    }

    /*
    * Validate header
    */
    const headerColumns = lines[0]
      .split(FILE_VALIDATION.DELIMITER)
      .map(column => column.trim())

    if (headerColumns.length !== FILE_VALIDATION.TOTAL_COLUMNS) {
      updateStatus(archive.id, ArchiveUploadStatus.INVALID_STRUCTURE, FILE_VALIDATION_MESSAGES.INVALID_STRUCTURE)
      return false
    }

    const validHeaders = FILE_VALIDATION.REQUIRED_HEADERS.every(
      (header, index) => header.trim().toLowerCase() === headerColumns[index].trim().toLowerCase()
    )

    if (!validHeaders) {
      updateStatus(archive.id, ArchiveUploadStatus.INVALID_STRUCTURE, FILE_VALIDATION_MESSAGES.INVALID_HEADERS)
      return false
    }

    /*
    * Validate every row
    */
    for (let i = 1; i < lines.length; i++) {
      const columns = lines[i]
        .split(FILE_VALIDATION.DELIMITER)

      if (columns.length !== FILE_VALIDATION.TOTAL_COLUMNS) {

        updateStatus(
          archive.id,
          ArchiveUploadStatus.INVALID_STRUCTURE,
          `La fila ${i + 1} tiene un número incorrecto de columnas.`
        )

        return false
      }
    }
    return true
  }

  /**
   * Compute SHA-256 hash for a given File object.
   */
  async function calculateHash(id) {
    const archive = archives.value.find(a => a.id === id)

    if (!archive || !archive.file) return false

    updateStatus(archive.id, ArchiveUploadStatus.HASHING)

    try {
      const arrayBuffer = await archive.file.arrayBuffer()
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
      const hash = Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')

      updateHash(archive.id, hash)

      return true
    } catch {
      updateStatus(
        archive.id,
        ArchiveUploadStatus.ERROR,
        'No fue posible calcular el hash del archivo.'
      )

      return false
    }
  }

  async function validateArchive(id) {
    const archive = archives.value.find(a => a.id === id)

    if (!archive || !archive.file) return false

    updateStatus(archive.id, ArchiveUploadStatus.VALIDATING_API)

    try {
      const response = await archivesService.validateArchive({
        hash: archive.hash,
        name: archive.name
      })

      if (response.hash){
        updateStatus(archive.id, ArchiveUploadStatus.DUPLICATED, response.message)
        return false
      }

      if(response.name){
        archive.name = response.new_name
        updateStatus(archive.id, ArchiveUploadStatus.READY_TO_UPLOAD, `Se cambio el nombre del archivo a ${response.new_name}`)
      } else {
        updateStatus(archive.id, ArchiveUploadStatus.READY_TO_UPLOAD)
      }

      return true
    } catch {
      updateStatus(
        archive.id,
        ArchiveUploadStatus.ERROR,
        'No fue posible validar el archivo.'
      )

      return false
    }
  }

  async function uploadArchive(id) {
    const archive = archives.value.find(a => a.id === id)

    if (!archive || !archive.file) return false

    if (archive.processCanceled)
      return false

    if (archive.status !== ArchiveUploadStatus.READY_TO_UPLOAD)
      return false

    try {
      updateStatus(archive.id, ArchiveUploadStatus.UPLOADING)

      await archivesService.storeArchive({
        file: archive.file,
        hash_file: archive.hash
      })

      updateStatus(archive.id, ArchiveUploadStatus.COMPLETED)
      releaseArchive(id)

      return true
    } catch {
      updateStatus(
        archive.id,
        ArchiveUploadStatus.ERROR,
        'No fue posible subir el archivo.'
      )

      return false
    }
  }

  return {
    archives,
    isUploading,
    totalArchives,
    completedArchives,
    progress,
    hasPendingArchives,
    addArchives,
    removeArchive,
    clearArchives,
    updateStatus,
    updateHash,
    updateProgress,
    releaseArchive,
    releaseAllFiles,
    validateMetadataStructure,
    isCanceled,
    cancelArchive,
    calculateHash,
    validateArchive,
    uploadArchive,
    uploadReadyArchives
  }
})