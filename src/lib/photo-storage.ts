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

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed. Allowed types: ${ALLOWED_TYPES.join(', ')}`)
  }

  // Generate unique filename
  const hash = crypto.randomBytes(16).toString('hex')
  const ext = path.extname(file.name)
  const filename = `${hash}${ext}`
  const filepath = path.join(UPLOAD_DIR, filename)

  // Save file
  const buffer = Buffer.from(await file.arrayBuffer())
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
