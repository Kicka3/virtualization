import {useCallback, useRef, useState} from "react";
import {useVirtualFilter} from "@/hook";
import {containerHeight, itemHeight} from "@/constants";
import s from './VirtualizationList.module.scss'


const createItems = () =>
    Array.from({length: 100}, (_, index) => ({
        id: Math.random().toString(36).slice(2),
        text: String(index),
    }));


export function VirtualizationList() {
    const [listItems, setListItems] = useState(createItems);
    const scrollElementRef = useRef<HTMLDivElement>(null);

    const {virtualItems, totalHeight} = useVirtualFilter({
        itemHeight: itemHeight,
        itemsCount: listItems.length,
        listHeight: containerHeight,
        getScrollElement: useCallback(() => scrollElementRef.current, []),
    });

    const onReverseTable = () => {
        setListItems((items) => items.slice().reverse())
    }

    return (
        <section className={s.listContainer}>
            <h1>List</h1>
            <div style={{marginBottom: 12}}>
                <button onClick={onReverseTable} >
                    reverse
                </button>
            </div>
            <div ref={scrollElementRef}
                className={s.itemsWrapper}
                style={{height: containerHeight}}
            >
                <ul style={{height: totalHeight}}>
                    {virtualItems.map((virtualItem) => {
                        const item = listItems[virtualItem.index]!;

                        return (
                            <li className={s.tableItem}
                                style={{
                                    transform: `translateY(${virtualItem.offsetTop}px)`,
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