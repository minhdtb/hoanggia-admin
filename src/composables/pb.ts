import PocketBase from 'pocketbase'

const appConfig = useAppConfig()
const pb = new PocketBase(appConfig.backend.url)

export const usePb = () => {
    return pb
}
