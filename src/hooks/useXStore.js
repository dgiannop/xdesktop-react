import { useEffect, useState } from "react";

export function useXStore(store) {
    const [, setVersion] = useState(0);

    useEffect(() => {
        if (!store)
            return undefined;

        return store.subscribe((version) => {
            setVersion(version);
        });
    }, [store]);
}
