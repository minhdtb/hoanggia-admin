import PocketBase, {AsyncAuthStore} from 'pocketbase'

const appConfig = useAppConfig()

const store = new AsyncAuthStore({
    save: async (serialized) => {
        localStorage.setItem('pb', JSON.stringify(serialized))
    },
    initial: localStorage.getItem('pb') ?? '',
});

const pb = new PocketBase(appConfig.backend.url, store)

export const usePb = (): PocketBase => {
    return pb
}
