import { useLayoutEffect, useRef, useState } from "react";
import { XItemOwner, XItemType } from "../model/XItem.js";

export default function XView({ view, desktop, onActivate }) {
    const inputRef = useRef(null);
    const [editValue, setEditValue] = useState("");
    const [isDropTarget, setIsDropTarget] = useState(false);
    const [dropFolderItemId, setDropFolderItemId] = useState(null);

    function getRenameSelectionRange(item) {
        const title = item?.title ?? "";

        if (item?.type !== XItemType.ITEM)
            return { start: 0, end: title.length };

        const dotIndex = title.lastIndexOf(".");

        if (dotIndex <= 0)
            return { start: 0, end: title.length };

        return { start: 0, end: dotIndex };
    }

    function selectRenameText(item) {
        if (!inputRef.current)
            return;

        const range = getRenameSelectionRange(item);
        inputRef.current.focus();
        inputRef.current.setSelectionRange(range.start, range.end);
    }

    useLayoutEffect(() => {
        if (!view.editingItemId)
            return;

        const item = view.items.find(x => x.id === view.editingItemId);
        if (!item)
            return;

        setEditValue(item.title);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                selectRenameText(item);
            });
        });
    }, [view.editingItemId, view.items]);

    function handleViewMouseDown(e) {
        if (e.target === e.currentTarget) {
            view.clearSelection();
            view.endEditItem();

            if (onActivate)
                onActivate();
            else
                desktop.notify();
        }
    }

    function handleItemClick(e, item) {
        const wasSelected = view.isSelected(item.id);
        const clickedLabel = e.target.closest(".desktop-icon-label");

        if (view.isEditing(item.id))
            return;

        if (wasSelected && item.owner === XItemOwner.USER && clickedLabel) {
            view.beginEditItem(item.id);
            desktop.notify();
            return;
        }

        view.selectItem(item.id);
        view.endEditItem();

        if (onActivate)
            onActivate();
        else
            desktop.notify();
    }

    function handleItemDoubleClick(item) {
        if (!desktop)
            return;

        item.activate(desktop);
    }

    function handleViewContextMenu(e) {
        e.preventDefault();

        if (!desktop)
            return;

        view.clearSelection();
        view.endEditItem();

        const menuItems = desktop.buildViewContextMenu(view);

        desktop.contextMenu.open(
            e.clientX,
            e.clientY,
            menuItems,
            view
        );

        if (onActivate)
            onActivate();
        else
            desktop.notify();
    }

    function handleItemContextMenu(e, item) {
        e.preventDefault();
        e.stopPropagation();

        if (!desktop)
            return;

        view.selectItem(item.id);
        view.endEditItem();

        const menuItems = desktop.buildItemContextMenu(item, view);

        desktop.contextMenu.open(
            e.clientX,
            e.clientY,
            menuItems,
            item
        );

        if (onActivate)
            onActivate();
        else
            desktop.notify();
    }

    function handleEditChange(e) {
        setEditValue(e.target.value);
    }

    function commitEdit(item) {
        const trimmed = editValue.trim();

        if (item.owner === XItemOwner.SYSTEM) {
            view.endEditItem();
            desktop.notify();
            return;
        }

        if (trimmed.length > 0)
            desktop.renameItem(item, trimmed);

        view.endEditItem();
        desktop.notify();
    }

    function cancelEdit() {
        view.endEditItem();
        desktop.notify();
    }

    function handleEditKeyDown(e, item) {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            commitEdit(item);
        }
        else if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            cancelEdit();
        }
    }

    function handleItemDragStart(e, item) {
        if (!desktop)
            return;

        if (view.isEditing(item.id)) {
            e.preventDefault();
            return;
        }

        if (item.owner !== XItemOwner.USER) {
            e.preventDefault();
            return;
        }

        view.selectItem(item.id);
        view.endEditItem();

        desktop.beginDrag(item, view.path);

        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", item.path || item.title || "");
        }

        desktop.notify();
    }

    function handleItemDragEnd() {
        if (!desktop)
            return;

        setIsDropTarget(false);
        setDropFolderItemId(null);
        desktop.clearDrag();
    }

    function handleViewDragOver(e) {
        if (!desktop?.dragItem)
            return;

        e.preventDefault();
        setIsDropTarget(true);

        if (e.dataTransfer)
            e.dataTransfer.dropEffect = "move";
    }

    function handleViewDragLeave(e) {
        if (e.currentTarget === e.target)
            setIsDropTarget(false);
    }

    function handleViewDrop(e) {
        e.preventDefault();

        if (!desktop?.dragItem)
            return;

        setIsDropTarget(false);
        setDropFolderItemId(null);

        const targetPath = view.path ?? "";
        desktop.moveDraggedItem(targetPath);
    }

    function handleFolderItemDragOver(e, item) {
        if (!desktop?.dragItem)
            return;

        if (item.type !== XItemType.FOLDER)
            return;

        e.preventDefault();
        e.stopPropagation();
        setDropFolderItemId(item.id);

        if (e.dataTransfer)
            e.dataTransfer.dropEffect = "move";
    }

    function handleFolderItemDragLeave(e, item) {
        if (e.currentTarget === e.target && dropFolderItemId === item.id)
            setDropFolderItemId(null);
    }

    function handleFolderItemDrop(e, item) {
        if (item.type !== XItemType.FOLDER)
            return;

        e.preventDefault();
        e.stopPropagation();

        if (!desktop?.dragItem)
            return;

        setIsDropTarget(false);
        setDropFolderItemId(null);

        desktop.moveDraggedItem(item.path);
    }

    function iconForItem(item) {
        if (item.icon)
            return item.icon;

        if (item.type === XItemType.APP)
            return "/images/react.png";

        return "/images/Generic.png";
    }

    return (
        <div
            className={`icons${isDropTarget ? " drag-target" : ""}`}
            onMouseDown={handleViewMouseDown}
            onContextMenu={handleViewContextMenu}
            onDragOver={handleViewDragOver}
            onDragLeave={handleViewDragLeave}
            onDrop={handleViewDrop}
        >
            {view.items.map(item => (
                <button
                    key={item.id}
                    type="button"
                    draggable={item.owner === XItemOwner.USER && !view.isEditing(item.id)}
                    className={`desktop-icon${view.isSelected(item.id) ? " selected" : ""}${dropFolderItemId === item.id ? " drop-target" : ""}`}
                    onClick={(e) => handleItemClick(e, item)}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                    onContextMenu={(e) => handleItemContextMenu(e, item)}
                    onDragStart={(e) => handleItemDragStart(e, item)}
                    onDragEnd={handleItemDragEnd}
                    onDragOver={(e) => handleFolderItemDragOver(e, item)}
                    onDragLeave={(e) => handleFolderItemDragLeave(e, item)}
                    onDrop={(e) => handleFolderItemDrop(e, item)}
                >
                    <span className="desktop-icon-visual">
                        <img src={iconForItem(item)} alt="" draggable="false" />
                    </span>

                    <span className="desktop-icon-label">
                        {view.isEditing(item.id) ? (
                            <input
                                ref={inputRef}
                                type="text"
                                value={editValue}
                                onChange={handleEditChange}
                                onKeyDown={(e) => handleEditKeyDown(e, item)}
                                onBlur={() => commitEdit(item)}
                                onFocus={() => selectRenameText(item)}
                                onMouseDown={(e) => e.stopPropagation()}
                                onMouseUp={(e) => e.preventDefault()}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            item.title
                        )}
                    </span>
                </button>
            ))}
        </div>
    );
}
