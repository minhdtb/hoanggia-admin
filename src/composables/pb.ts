import PocketBase from 'pocketbase'


export const usePb = (): PocketBase => {
    const appConfig = useAppConfig()
    return new PocketBase(appConfig.backend.url)
}
