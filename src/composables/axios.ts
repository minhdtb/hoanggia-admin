import axios from 'axios'

export const useGoong = () => {
  const appConfig = useAppConfig();
  const a = axios.create({
    baseURL: appConfig.backend.baseGoongUrl,
  })
  return a
}
