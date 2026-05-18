import { ref, onMounted, onUnmounted } from 'vue'

const DB_NAME = 'liliblog_editor'
const DB_VERSION = 1
const STORE_NAME = 'drafts'
const SAVE_INTERVAL = 30000
const CHANGE_THRESHOLD = 50

interface SaveState {
    status: 'idle' | 'saving' | 'saved' | 'error'
    lastSaved: Date | null
    error: string | null
}

interface DraftRecord {
    key: string
    data: string
    timestamp: number
    version: number
}

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)
        request.onupgradeneeded = () => {
            const db = request.result
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'key' })
            }
        }
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
    })
}

async function saveToIndexedDB(key: string, data: string): Promise<void> {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)

    const countReq = store.count()
    await new Promise<void>((resolve, reject) => {
        countReq.onsuccess = async () => {
            if (countReq.result >= 10) {
                const allReq = store.getAll()
                allReq.onsuccess = () => {
                    const records = allReq.result as DraftRecord[]
                    records.sort((a, b) => a.timestamp - b.timestamp)
                    const toDelete = records.slice(0, records.length - 9)
                    for (const rec of toDelete) {
                        store.delete(rec.key)
                    }
                    resolve()
                }
                allReq.onerror = () => reject(allReq.error)
            } else {
                resolve()
            }
        }
        countReq.onerror = () => reject(countReq.error)
    })

    const versionKey = `${key}_version`
    const versionReq = store.get(versionKey)
    await new Promise<void>((resolve, reject) => {
        versionReq.onsuccess = () => {
            const currentVersion = (versionReq.result as DraftRecord)?.data
                ? parseInt((versionReq.result as DraftRecord).data)
                : 0
            const newVersion = currentVersion + 1
            store.put({ key: versionKey, data: String(newVersion), timestamp: Date.now(), version: newVersion })
            store.put({ key: `${key}_v${newVersion}`, data, timestamp: Date.now(), version: newVersion })
            resolve()
        }
        versionReq.onerror = () => reject(versionReq.error)
    })
}

async function loadFromIndexedDB(key: string): Promise<string | null> {
    const db = await openDB()
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const versionKey = `${key}_version`
    const versionReq = store.get(versionKey)

    return new Promise((resolve) => {
        versionReq.onsuccess = () => {
            const currentVersion = (versionReq.result as DraftRecord)?.data
                ? parseInt((versionReq.result as DraftRecord).data)
                : 0
            if (currentVersion === 0) {
                resolve(null)
                return
            }
            const dataReq = store.get(`${key}_v${currentVersion}`)
            dataReq.onsuccess = () => {
                const record = dataReq.result as DraftRecord | undefined
                resolve(record?.data || null)
            }
            dataReq.onerror = () => resolve(null)
        }
        versionReq.onerror = () => resolve(null)
    })
}

function saveToLocalStorage(key: string, data: string): void {
    try {
        localStorage.setItem(`draft_${key}`, data)
        localStorage.setItem(`draft_${key}_time`, String(Date.now()))
    } catch {
        // localStorage full
    }
}

function loadFromLocalStorage(key: string): string | null {
    return localStorage.getItem(`draft_${key}`)
}

export function useAutoSave(key: string, getData: () => string, _onRestore?: (data: string) => void) {
    const state = ref<SaveState>({
        status: 'idle',
        lastSaved: null,
        error: null,
    })

    let timer: ReturnType<typeof setInterval> | null = null
    let lastSavedData = ''
    let changeCount = 0
    let isDirty = false

    async function save() {
        const data = getData()
        if (!data || data === lastSavedData) return

        state.value = { status: 'saving', lastSaved: state.value.lastSaved, error: null }
        try {
            saveToLocalStorage(key, data)
            await saveToIndexedDB(key, data)
            lastSavedData = data
            isDirty = false
            changeCount = 0
            state.value = { status: 'saved', lastSaved: new Date(), error: null }
        } catch (e: any) {
            state.value = { status: 'error', lastSaved: state.value.lastSaved, error: e.message || '保存失败' }
        }
    }

    function notifyChange() {
        changeCount++
        isDirty = true
        if (changeCount >= CHANGE_THRESHOLD) {
            save()
        }
    }

    async function checkAndRestore(): Promise<boolean> {
        const localData = loadFromLocalStorage(key)
        if (localData && localData !== getData()) {
            return true
        }
        const dbData = await loadFromIndexedDB(key)
        if (dbData && dbData !== getData()) {
            return true
        }
        return false
    }

    async function restore(): Promise<string | null> {
        const localData = loadFromLocalStorage(key)
        if (localData) {
            lastSavedData = localData
            return localData
        }
        const dbData = await loadFromIndexedDB(key)
        if (dbData) {
            lastSavedData = dbData
            return dbData
        }
        return null
    }

    function markClean() {
        isDirty = false
        changeCount = 0
        lastSavedData = getData()
        state.value = { status: 'saved', lastSaved: new Date(), error: null }
    }

    async function clearDraft() {
        try {
            localStorage.removeItem(`draft_${key}`)
            localStorage.removeItem(`draft_${key}_time`)
            const db = await openDB()
            const tx = db.transaction(STORE_NAME, 'readwrite')
            const store = tx.objectStore(STORE_NAME)
            const versionKey = `${key}_version`
            const versionReq = store.get(versionKey)
            await new Promise<void>((resolve) => {
                versionReq.onsuccess = () => {
                    const currentVersion = (versionReq.result as DraftRecord)?.data
                        ? parseInt((versionReq.result as DraftRecord).data)
                        : 0
                    for (let v = 1; v <= currentVersion; v++) {
                        store.delete(`${key}_v${v}`)
                    }
                    store.delete(versionKey)
                    resolve()
                }
                versionReq.onerror = () => resolve()
            })
        } catch {
            // skip
        }
        isDirty = false
        changeCount = 0
        lastSavedData = ''
        state.value = { status: 'idle', lastSaved: null, error: null }
    }

    function beforeUnloadHandler(e: BeforeUnloadEvent) {
        if (isDirty) {
            e.preventDefault()
        }
    }

    onMounted(() => {
        timer = setInterval(save, SAVE_INTERVAL)
        window.addEventListener('beforeunload', beforeUnloadHandler)
    })

    onUnmounted(() => {
        if (timer) clearInterval(timer)
        window.removeEventListener('beforeunload', beforeUnloadHandler)
        if (isDirty) {
            save()
        }
    })

    return {
        state,
        save,
        notifyChange,
        checkAndRestore,
        restore,
        markClean,
        clearDraft,
    }
}
