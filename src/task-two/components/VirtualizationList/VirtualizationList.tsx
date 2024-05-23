import {useCallback, useRef, useState} from "react";
import {useVirtualFilter} from "../../hook";
import {containerHeight, itemHeight} from "../../constants";
import s from './VirtualizationList.module.scss'


const createItems = () =>
    Array.from({length: 100}, (_, index) => ({
        id: Math.random().toString(36).slice(2),
        text: String(index),
    }));


export function VirtualizationList() {
    const [listItems] = useState(createItems);
    const scrollElementRef = useRef<HTMLDivElement>(null);

    const {virtualElements,totalListHeight} = useVirtualFilter({
        itemHeight: itemHeight,
        itemsCount: listItems.length,
        listHeight: containerHeight,
        getScrollElement: useCallback(() => scrollElementRef.current, []),
    });

    return (
        <section className={s.listContainer}>
            <h1>List</h1>
            <div ref={scrollElementRef}
                className={s.itemsWrapper}
                style={{height: containerHeight}}
            >
                <ul style={{height: totalListHeight}}>
                    {virtualElements.map((virtualItem) => {
                        const item = listItems[virtualItem.index]!;

                        return (
                            <li className={s.tableItem}
                                style={{
                                    willChange: 'transform',
                                    transform: `translateY(${virtualItem.topOffset}px)`,
                                    height: itemHeight,
                                }}
                                key={item.id}
                            >
                                {item.text}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}