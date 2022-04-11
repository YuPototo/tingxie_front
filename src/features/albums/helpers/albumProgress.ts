const KEY_PROGRESS = 'album_index_'
const KEY_LATEST_ALBUM = 'latest_album'

function getAlbumProgress(albumId: string) {
    const key = KEY_PROGRESS + albumId
    const value = localStorage.getItem(key)
    const maybeNum = value === null ? 0 : +value
    return isNaN(maybeNum) ? 0 : maybeNum
}

function getLatestAlbum() {
    return localStorage.getItem(KEY_LATEST_ALBUM)
}

function setAlbumProgress(albumId: string, index: number) {
    const key = KEY_PROGRESS + albumId
    localStorage.setItem(key, `${index}`)
}

function setLatestAlbum(albumId: string) {
    localStorage.setItem(KEY_LATEST_ALBUM, albumId)
}

export default {
    getAlbumProgress,
    getLatestAlbum,
    setAlbumProgress,
    setLatestAlbum,
}
