// Offline-First Sync Utility for HDD Operations
// Uses IndexedDB for offline data storage and sync queue

export interface SyncQueueItem {
  id?: number
  method: string
  url: string
  body: any
  timestamp: number
  retries?: number
}

const DB_NAME = 'hdd-offline-db'
const DB_VERSION = 1

let dbInstance: IDBDatabase | null = null

export async function initOfflineDB(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      dbInstance = request.result
      resolve(dbInstance)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Daily Reports Store
      if (!db.objectStoreNames.contains('dailyReports')) {
        db.createObjectStore('dailyReports', { keyPath: 'id' })
      }

      // Rod Passes Store
      if (!db.objectStoreNames.contains('rodPasses')) {
        db.createObjectStore('rodPasses', { keyPath: 'id' })
      }

      // Photos Store
      if (!db.objectStoreNames.contains('photos')) {
        db.createObjectStore('photos', { keyPath: 'id' })
      }

      // Sync Queue Store
      if (!db.objectStoreNames.contains('syncQueue')) {
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

export async function saveOffline(storeName: string, data: any): Promise<void> {
  const db = await initOfflineDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    const request = store.put(data)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function getOffline(storeName: string, id: string): Promise<any> {
  const db = await initOfflineDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)
    const request = store.get(id)

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function queueForSync(method: string, url: string, body: any): Promise<void> {
  const db = await initOfflineDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['syncQueue'], 'readwrite')
    const store = transaction.objectStore('syncQueue')
    const request = store.add({
      method,
      url,
      body,
      timestamp: Date.now(),
      retries: 0
    })

    request.onsuccess = () => {
      console.log('Queued for sync:', url)
      resolve()
    }
    request.onerror = () => reject(request.error)
  })
}

export async function processQueue(): Promise<{ success: number; failed: number }> {
  const db = await initOfflineDB()
  let successCount = 0
  let failedCount = 0

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['syncQueue'], 'readwrite')
    const store = transaction.objectStore('syncQueue')
    const request = store.openCursor()

    request.onsuccess = async (event) => {
      const cursor = (event.target as IDBRequest).result as IDBCursorWithValue

      if (cursor) {
        const item: SyncQueueItem = cursor.value

        try {
          const response = await fetch(item.url, {
            method: item.method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.body)
          })

          if (response.ok) {
            cursor.delete()
            successCount++
            console.log('Synced:', item.url)
          } else if (item.retries && item.retries >= 3) {
            cursor.delete()
            failedCount++
            console.error('Max retries exceeded:', item.url)
          } else {
            cursor.update({ ...item, retries: (item.retries || 0) + 1 })
            failedCount++
          }
        } catch (error) {
          if (item.retries && item.retries >= 3) {
            cursor.delete()
            failedCount++
          } else {
            cursor.update({ ...item, retries: (item.retries || 0) + 1 })
            failedCount++
          }
          console.error('Sync failed:', item.url, error)
        }

        cursor.continue()
      } else {
        resolve({ success: successCount, failed: failedCount })
      }
    }

    request.onerror = () => reject(request.error)
  })
}

export async function getPendingCount(): Promise<number> {
  const db = await initOfflineDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['syncQueue'], 'readonly')
    const store = transaction.objectStore('syncQueue')
    const request = store.count()

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Auto-sync when online
if (typeof window !== 'undefined') {
  window.addEventListener('online', async () => {
    console.log('Back online - syncing queued items...')
    const result = await processQueue()
    console.log(`Sync complete: ${result.success} success, ${result.failed} failed`)
  })

  // Periodic sync every 5 minutes
  setInterval(async () => {
    if (navigator.onLine) {
      await processQueue()
    }
  }, 5 * 60 * 1000)
}
