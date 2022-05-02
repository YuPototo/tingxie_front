const API_URL = process.env.REACT_APP_API_URL
const VERSION = process.env.REACT_APP_VERSION
const HOME_TRACK_ID = process.env.REACT_APP_HOME_TRACK_ID

if (process.env.NODE_ENV !== 'test' && !API_URL) {
    throw new Error('env 环境找不到 API_URL')
}

if (!VERSION) {
    throw new Error('env 环境找不到 VERSION')
}

if (!HOME_TRACK_ID) {
    throw new Error('.env 找不到 HOME_TRACK_ID')
}

const config = {
    API_URL,
    VERSION,
    HOME_TRACK_ID,
}

export default config
