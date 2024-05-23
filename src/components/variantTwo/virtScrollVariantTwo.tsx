import {useEffect, useRef, useState} from "react";

interface VirtualListProps {
    items: number[];
    itemHeight: number;
    containerHeight: number;
}

export const VirtualList = ({ items, itemHeight, containerHeight }: VirtualListProps) => {
    const containerRef = useRef(null);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(4);

    const totalHeight = items.length * itemHeight;

    const handleScroll = () => {
        const container = containerRef.current;
        if (container) {
            const { scrollTop } = container;
            const start = Math.floor(scrollTop / itemHeight);
            setStartIndex(start);
            setEndIndex(start + 4);
        }
    };

    useEffect(() => {
        setEndIndex(startIndex + 4);
    }, [startIndex]);

    return (
        <div
            ref={containerRef}
            style={{ height: containerHeight, overflowY: 'auto', position: 'relative' }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight }}>
                <ul style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
                    {items.slice(startIndex, endIndex).map((item, index) => (
                        <li
                            key={startIndex + index}
                            style={{ height: itemHeight, lineHeight: `${itemHeight}px` }}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

//