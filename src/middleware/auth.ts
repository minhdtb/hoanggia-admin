export default defineNuxtRouteMiddleware((to, from) => {
    const pb = usePb();

    if (pb.authStore.isValid && to?.name === 'login') {
        return navigateTo('/')
    }

    if (!pb.authStore.isValid && to?.name !== 'login') {
        abortNavigation();
        return navigateTo('/login');
    }
});
