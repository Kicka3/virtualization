export type UseFixedSizeListProps = {
    itemsCount: number;
    itemHeight: number;
    listHeight: number;
    overscan?: number;
    scrollingDelay?: number;
    getScrollElement: () => HTMLElement | null;
}