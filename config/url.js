import env from './env'

const DEV_URL = 'http://localhost:3066'
const PRO_URL = 'http://localhost:3066'

export default env === 'development' ? DEV_URL : PRO_URL
