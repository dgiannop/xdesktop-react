import { useState } from "react";
import { XItemType } from "../model/XItem.js";

export default function Desktop({ desktop, refresh }) {
    const [selectedItemId, setSelectedItemId] = useState(null);

    function handleDesktopMouseDown(e) {
        if (e.target === e.currentTarget) {
            setSelectedItemId(null);
        }
    }

    function handleItemClick(item) {
        setSelectedItemId(item.id);
    }

    function handleItemDoubleClick(item) {
        item.activate(desktop);
        refresh();
    }

    function iconForItem(item) {
        if (item.icon)
            return item.icon;

        if (item.type === XItemType.APP)
            return "/images/react.png";

        return "/images/Generic.png";
    }

    return (
        <div className="icons" onMouseDown={handleDesktopMouseDown}>
            {desktop.items.map(item => (
                <button
                    key={item.id}
                    type="button"
                    className={`desktop-icon${selectedItemId === item.id ? " selected" : ""}`}
                    onClick={() => handleItemClick(item)}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                >
                    <span className="desktop-icon-visual">
                        <img src={iconForItem(item)} alt="" draggable="false" />
                    </span>

                    <span className="desktop-icon-label">
                        {item.title}
                    </span>
                </button>
            ))}
        </div>
    );
}