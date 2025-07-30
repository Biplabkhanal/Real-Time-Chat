export function filterBlockedUsers(friends, blockedUsers, blockedByUsers) {
    const blockedIds = blockedUsers.map((u) => u.id);
    const blockedByIds = blockedByUsers.map((u) => u.id);
    return friends.filter(
        (friend) =>
            !blockedIds.includes(friend.id) && !blockedByIds.includes(friend.id)
    );
}
