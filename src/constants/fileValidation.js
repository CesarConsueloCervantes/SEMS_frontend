/**
 * File validation parameters for SAT monthly declaration metadata files.
 * Defines size limits, allowed extensions, delimiter, and expected header columns.
 */
export const FILE_VALIDATION = {
  MAX_SIZE: 50 * 1024 * 1024, // 50 MB
  MIN_SIZE: 150,
  ALLOWED_EXTENSIONS: ['.txt', '.csv'],
  DELIMITER: '~',
  TOTAL_COLUMNS: 12,
  REQUIRED_HEADERS: [
    'Uuid',
    'RfcEmisor',
    'NombreEmisor',
    'RfcReceptor',
    'NombreReceptor',
    'PacCertifico',
    'FechaEmision',
    'FechaCertificacionSat',
    'Monto',
    'EfectoComprobante',
    'Estatus',
    'FechaCancelacion'
  ]
}

export const FILE_VALIDATION_MESSAGES = {

    INVALID_EXTENSION:
        'La extensión del archivo no es válida.',

    INVALID_SIZE:
        'El archivo supera el tamaño permitido.',

    INVALID_STRUCTURE:
        'La estructura del archivo es inválida.',

    INVALID_HEADERS:
        'Los encabezados del archivo no corresponden al formato esperado.'

}