'use client'

import { useState } from 'react'
import { X, Trash2, Download, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'

interface Photo {
  id: string
  url: string
  thumbnailUrl?: string
  filename: string
  createdAt: string
  uploadedBy: {
    name: string | null
    email: string
  }
}

interface PhotoGalleryProps {
  photos: Photo[]
  onDelete?: (photoId: string) => void
  canDelete?: boolean
}

export default function PhotoGallery({ photos, onDelete, canDelete = false }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (photos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No photos uploaded yet
      </div>
    )
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length)
  }

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)
  }

  const handleDelete = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return

    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Delete failed')

      onDelete?.(photoId)
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete photo')
    }
  }

  const downloadPhoto = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div key={photo.id} className="relative group">
            <img
              src={photo.thumbnailUrl || photo.url}
              alt={photo.filename}
              className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openLightbox(index)}
            />

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => openLightbox(index)}
                className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-200"
                title="View"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <button
                onClick={() => downloadPhoto(photo.url, photo.filename)}
                className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-200"
                title="Download"
              >
                <Download className="h-5 w-5" />
              </button>
              {canDelete && (
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  title="Delete"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Photo info */}
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              <p className="truncate">{photo.filename}</p>
              <p>By {photo.uploadedBy.name || photo.uploadedBy.email}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Navigation */}
          {photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-4 text-white hover:text-gray-300"
              >
                <ChevronLeft className="h-12 w-12" />
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 text-white hover:text-gray-300"
              >
                <ChevronRight className="h-12 w-12" />
              </button>
            </>
          )}

          {/* Image */}
          <div className="max-w-6xl max-h-[90vh] p-4">
            <img
              src={photos[currentIndex].url}
              alt={photos[currentIndex].filename}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image info */}
            <div className="mt-4 text-center text-white">
              <p className="font-semibold">{photos[currentIndex].filename}</p>
              <p className="text-sm text-gray-300">
                Uploaded by {photos[currentIndex].uploadedBy.name || photos[currentIndex].uploadedBy.email}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(photos[currentIndex].createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                {currentIndex + 1} / {photos.length}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => downloadPhoto(photos[currentIndex].url, photos[currentIndex].filename)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                Download
              </button>
              {canDelete && (
                <button
                  onClick={() => {
                    handleDelete(photos[currentIndex].id)
                    closeLightbox()
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex items-center gap-2"
                >
                  <Trash2 className="h-5 w-5" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
