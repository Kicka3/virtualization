import {Simple} from "@/components/simpleVirtualized/example";

export function App() {

    return (
        <>
        <div>My virtualized bibla</div>
        <Simple/>
        </>
    )
}

// //Variant 2
// export function App() {
//
//     const items = Array.from({ length: 100 }, (_, index) => index + 1);
//
//     return (
//         <div>
//             <h1>Virtual List Example</h1>
//             <VirtualList
//                 items={items}
//                 itemHeight={60}
//                 containerHeight={240}
//             />
//         </div>
//     );
// }

