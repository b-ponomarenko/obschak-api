export const sortUsers = (users, requestUserId) => [...users].sort((a, b) => {
    if (a === requestUserId) {
        return -1;
    }

    if (b === requestUserId) {
        return 1;
    }

    return a - b;
})
