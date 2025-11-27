// Photo Storage Utility
// Abstraction layer for photo storage (local filesystem for dev, cloud-ready for production)

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'photos')
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export interface PhotoUploadResult {
  filename: string
  url: string
  thumbnailUrl?: string
  size: number
  mimeType: string
}

export interface PhotoUploadOptions {
  generateThumbnail?: boolean
  maxWidth?: number
  maxHeight?: number
}

// Magic number signatures for image validation
const MAGIC_NUMBERS: Record<string, number[][]> = {
  'image/jpeg': [[0xFF, 0xD8, 0xFF]],
  'image/jpg': [[0xFF, 0xD8, 0xFF]],
  'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]] // RIFF header (WebP starts with RIFF)
}

// Allowed extensions whitelist
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

/**
 * Validate file content by checking magic numbers
 */
function validateMagicNumber(buffer: Buffer, mimeType: string): boolean {
  const signatures = MAGIC_NUMBERS[mimeType]
  if (!signatures) return false

  return signatures.some(signature =>
    signature.every((byte, index) => buffer[index] === byte)
  )
}

/**
 * Sanitize and validate file extension
 */
function sanitizeExtension(filename: string): string {
  // Extract extension, lowercase, and strip any non-alphanumeric characters except dot
  const ext = path.extname(filename).toLowerCase().replace(/[^.a-z0-9]/g, '')
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error(`Invalid file extension: ${ext}`)
  }
  return ext
}

/**
 * Save a photo to local storage
 */
export async function savePhoto(
  file: File,
  options: PhotoUploadOptions = {}
): Promise<PhotoUploadResult> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  // Validate file type (client-provided MIME type)
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed. Allowed types: ${ALLOWED_TYPES.join(', ')}`)
  }

  // Read file buffer for magic number validation
  const buffer = Buffer.from(await file.arrayBuffer())

  // Validate actual file content via magic numbers (prevent MIME spoofing)
  if (!validateMagicNumber(buffer, file.type)) {
    throw new Error('File content does not match declared MIME type')
  }

  // Sanitize and validate extension
  const ext = sanitizeExtension(file.name)

  // Generate unique filename with sanitized extension
  const hash = crypto.randomBytes(16).toString('hex')
  const filename = `${hash}${ext}`

  // Use path.basename to prevent path traversal attacks
  const safeFilename = path.basename(filename)
  const filepath = path.join(UPLOAD_DIR, safeFilename)

  // Save file (buffer already created for magic number validation)
  fs.writeFileSync(filepath, buffer)

  const result: PhotoUploadResult = {
    filename,
    url: `/uploads/photos/${filename}`,
    size: file.size,
    mimeType: file.type
  }

  // Generate thumbnail if requested (basic implementation)
  if (options.generateThumbnail) {
    // For now, we'll use the same image
    // In production, use sharp or similar library to resize
    result.thumbnailUrl = result.url
  }

  return result
}

/**
 * Delete a photo from storage
 */
export async function deletePhoto(filename: string): Promise<void> {
  const filepath = path.join(UPLOAD_DIR, filename)

  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath)
  }
}

/**
 * Get photo metadata
 */
export async function getPhotoMetadata(filename: string): Promise<{ size: number; exists: boolean }> {
  const filepath = path.join(UPLOAD_DIR, filename)

  if (!fs.existsSync(filepath)) {
    return { size: 0, exists: false }
  }

  const stats = fs.statSync(filepath)
  return { size: stats.size, exists: true }
}

/**
 * Extract EXIF data from image (placeholder - would use exif-parser in production)
 */
export async function extractEXIF(file: File): Promise<Record<string, any>> {
  // Basic implementation - in production use exif-parser or similar
  return {
    filename: file.name,
    size: file.size,
    type: file.type,
    lastModified: new Date(file.lastModified).toISOString()
  }
}
