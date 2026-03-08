import { useEffect, useRef, useState } from "react";

export default function XContextMenu({ menu, desktop }) {
    const menuRef = useRef(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!menu || !menu.visible)
            return;

        const el = menuRef.current;
        if (!el)
            return;

        let x = menu.x;
        let y = menu.y;

        const rect = el.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width - 4;
        const maxY = window.innerHeight - rect.height - 4;

        x = Math.max(4, Math.min(x, maxX));
        y = Math.max(4, Math.min(y, maxY));

        setPos({ x, y });
    }, [menu?.visible, menu?.x, menu?.y, menu?.items?.length]);

    if (!menu || !menu.visible)
        return null;

    const style = {
        left: `${pos.x}px`,
        top: `${pos.y}px`
    };

    function handleItemClick(item) {
        menu.close();

        if (item.action)
            item.action();

        desktop.notify();
    }

    return (
        <div
            ref={menuRef}
            className="xcontext-menu"
            style={style}
            onMouseDown={(e) => e.stopPropagation()}
        >
            {menu.items.map((item, index) => (
                <button
                    key={index}
                    type="button"
                    className="xcontext-menu-item"
                    onClick={() => handleItemClick(item)}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
}
