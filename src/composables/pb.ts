import PocketBase from 'pocketbase';

export const usePb = (): PocketBase => {
  const appConfig = useAppConfig();
  const app = new PocketBase(appConfig.backend.url);
  app.autoCancellation(true);
  return app;
};
