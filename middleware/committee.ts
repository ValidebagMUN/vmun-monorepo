export default defineNuxtRouteMiddleware(async (from, to) => {
    //TODO: Find a way to implement committee redirection.
    /* const { data: user } = await useFetch('/api/users/me')
    if (!user) {
        // return navigateTo('/login')
        return abortNavigation();
    }
    if(user.value?.type === 'admin') return
    else if(user.value?.type === 'chair') {
        const { data: committee } = await useFetch('/api/committees/me')
        if (!committee) {
            return abortNavigation();
        }
        if (committee.value?.slug !== to.params.slug) {
            // return navigateTo(`/committees/${committee.value?.slug}`);
        }
    } */
})