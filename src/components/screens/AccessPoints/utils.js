export function filterByName(list, searchQuery) {
    return list.filter(access => access?.name.toLowerCase().includes(searchQuery.toLowerCase()));
}
