import { XItemType } from "../model/XItem.js";

export default function XView({ view, desktop, onActivate }) {
    function handleViewMouseDown(e) {
        if (e.target === e.currentTarget) {
            view.clearSelection();

            if (onActivate)
                onActivate();
            else
                desktop.notify();
        }
    }

    function handleItemClick(item) {
        view.selectItem(item.id);

        if (onActivate)
            onActivate();
        else
            desktop.notify();
    }

    function handleItemDoubleClick(item) {
        item.activate(desktop);

        if (onActivate)
            onActivate();
    }

    function iconForItem(item) {
        if (item.icon)
            return item.icon;

        if (item.type === XItemType.APP)
            return "/images/react.png";

        return "/images/Generic.png";
    }

    return (
        <div className="icons" onMouseDown={handleViewMouseDown}>
            {view.items.map(item => (
                <button
                    key={item.id}
                    type="button"
                    className={`desktop-icon${view.isSelected(item.id) ? " selected" : ""}`}
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
