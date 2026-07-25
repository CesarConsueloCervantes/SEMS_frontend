export async function calculateHash(file) {

    const buffer = await file.arrayBuffer()

    const hashBuffer = await crypto.subtle.digest(
        'SHA-256',
        buffer,
    )

    return [...new Uint8Array(hashBuffer)]
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('')
}