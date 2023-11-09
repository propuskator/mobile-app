export function getSortedListBySelected(list, selected) {
    const selectedIds = selected?.map(item => item?.id);
    const notSelected = list?.filter(item => !selectedIds?.includes(item?.id));

    return [
        ...(selected || []),
        ...(notSelected || [])
    ];
}
