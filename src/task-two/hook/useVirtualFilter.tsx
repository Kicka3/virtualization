import { useLayoutEffect, useMemo, useState } from "react";
import { DEFAULT_OVERSCAN } from "../constants";
import { UseFixedSizeListProps } from "@/task-two/types/types";

/**
 * Хук для управления виртуальным списком с фиксированным размером элементов.
 * @param {UseFixedSizeListProps} props - Свойства для управления виртуальным списком.
 * @returns {Object} Объект с данными о виртуальных элементах и их позициях.
 */
export function useVirtualFilter(props: UseFixedSizeListProps) {
    const {
        itemHeight, // Высота элемента списка.
        itemsCount, // Общее количество элементов.
        overscan = DEFAULT_OVERSCAN, // Дополнительное количество элементов для рендеринга.
        listHeight, // Высота контейнера списка.
        getScrollElement, // Функция для получения элемента, в котором происходит скроллинг.
    } = props;

    const [scrollPosition, setScrollPosition] = useState(0); // Текущая позиция скролла.

    /**
     * Обработка событий скролла и обновление состояния позиции скролла.
     */
    useLayoutEffect(() => {
        const scrollElement = getScrollElement();

        if (!scrollElement) {
            return;
        }

        const handleScroll = () => {
            const currentScrollPosition = scrollElement.scrollTop;
            setScrollPosition(currentScrollPosition);
        };

        handleScroll();

        scrollElement.addEventListener("scroll", handleScroll);

        return () => scrollElement.removeEventListener("scroll", handleScroll);
    }, [getScrollElement]);

    /**
     * Вычисление виртуальных элементов и их позиций на основе текущей позиции скролла.
     */
    const { virtualElements, startIndex, endIndex } = useMemo(() => {
        const startRange = scrollPosition;
        const endRange = scrollPosition + listHeight;

        let startIndex = Math.floor(startRange / itemHeight);
        let endIndex = Math.ceil(endRange / itemHeight);

        startIndex = Math.max(0, startIndex - overscan);
        endIndex = Math.min(itemsCount - 1, endIndex + overscan);

        const virtualElements = [];

        for (let i = startIndex; i <= endIndex; i++) {
            virtualElements.push({
                index: i,
                topOffset: i * itemHeight,
            });
        }
        return { virtualElements, startIndex, endIndex };
    }, [scrollPosition, listHeight, itemsCount]);

    const totalListHeight = itemHeight * itemsCount;

    return useMemo(() => {
        return {
            virtualElements,
            totalListHeight,
            startIndex,
            endIndex,
        };
    }, [virtualElements, totalListHeight, startIndex, endIndex]);
}