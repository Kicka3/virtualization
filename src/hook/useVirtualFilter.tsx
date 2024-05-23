import {useLayoutEffect, useMemo, useState} from "react";
import {DEFAULT_OVERSCAN} from "@/constants";
import {UseFixedSizeListProps} from "@/types/types";

/**
 * Пользовательский хук React для виртуализации списка с элементами фиксированного размера.
 * @param {UseFixedSizeListProps} props - Свойства для виртуализированного списка.
 * @returns {Object} Объект, содержащий виртуальные элементы, общую высоту и индексы.
 */
export function useVirtualFilter(props: UseFixedSizeListProps) {
    const {
        itemHeight, // Высота каждого элемента в списке.
        itemsCount, // Общее количество элементов в списке.
        overscan = DEFAULT_OVERSCAN, // Количество дополнительных элементов для рендеринга выше и ниже видимого диапазона.
        listHeight, // Высота контейнера списка.
        getScrollElement, // Функция для получения скроллируемого элемента.
    } = props;

    const [scrollTop, setScrollTop] = useState(0); // Текущая позиция скролла.

    /**
     * Эффект для обработки событий скролла и обновления состояния scrollTop.
     * @param {Function} getScrollElement - Функция для получения скроллируемого элемента.
     */
    useLayoutEffect(() => {
        const scrollElement = getScrollElement();

        if (!scrollElement) {
            return;
        }

        const handleScroll = () => {
            const scrollTop = scrollElement.scrollTop;

            setScrollTop(scrollTop);
        };

        handleScroll();

        scrollElement.addEventListener("scroll", handleScroll);

        return () => scrollElement.removeEventListener("scroll", handleScroll);
    }, [getScrollElement]);

    /**
     * Вычисление виртуальных элементов и их индексов на основе позиции скролла.
     * @param {number} scrollTop - Текущая позиция скролла.
     * @param {number} listHeight - Высота контейнера списка.
     * @param {number} itemsCount - Общее количество элементов в списке.
     */
    const {virtualItems, startIndex, endIndex} = useMemo(() => {
        const rangeStart = scrollTop;
        const rangeEnd = scrollTop + listHeight;

        let startIndex = Math.floor(rangeStart / itemHeight);
        let endIndex = Math.ceil(rangeEnd / itemHeight);

        startIndex = Math.max(0, startIndex - overscan);
        endIndex = Math.min(itemsCount - 1, endIndex + overscan);

        const virtualItems = [];

        for (let i = startIndex; i <= endIndex; i++) {
            virtualItems.push({
                index: i,
                offsetTop: i * itemHeight,
            });
        }
        return {virtualItems, startIndex, endIndex};
    }, [scrollTop, listHeight, itemsCount]);

    const totalHeight = itemHeight * itemsCount;

    return {
        virtualItems,
        totalHeight,
        startIndex,
        endIndex,
    };
}