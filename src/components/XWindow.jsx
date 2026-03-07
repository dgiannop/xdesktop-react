import { useRef } from "react";

const kResizeNone = "";
const kResizeLeft = "left";
const kResizeRight = "right";
const kResizeTop = "top";
const kResizeBottom = "bottom";
const kResizeTopLeft = "top-left";
const kResizeTopRight = "top-right";
const kResizeBottomLeft = "bottom-left";
const kResizeBottomRight = "bottom-right";

const kMinWidth = 240;
const kMinHeight = 140;
const kEdgeSize = 6;

export default function XWindow({ win, desktop, refresh }) {
    const dragRef = useRef(null);
    const resizeRef = useRef(null);

    function handleClose() {
        win.close();
        refresh();
    }

    function handleTitleMouseDown(e) {
        if (e.button !== 0)
            return;

        if (e.target.closest(".xwindow-controls"))
            return;

        desktop.bringToFront(win.id);
        refresh();

        dragRef.current = {
            startMouseX: e.clientX,
            startMouseY: e.clientY,
            startX: win.x,
            startY: win.y
        };

        window.addEventListener("mousemove", handleDragMouseMove);
        window.addEventListener("mouseup", handleDragMouseUp);
    }

    function handleDragMouseMove(e) {
        const drag = dragRef.current;
        if (!drag)
            return;

        const dx = e.clientX - drag.startMouseX;
        const dy = e.clientY - drag.startMouseY;

        win.moveTo(drag.startX + dx, drag.startY + dy);
        refresh();
    }

    function handleDragMouseUp() {
        dragRef.current = null;
        window.removeEventListener("mousemove", handleDragMouseMove);
        window.removeEventListener("mouseup", handleDragMouseUp);
    }

    function getResizeDirection(e) {
        const rect = e.currentTarget.getBoundingClientRect();

        const nearLeft = e.clientX >= rect.left && e.clientX <= rect.left + kEdgeSize;
        const nearRight = e.clientX <= rect.right && e.clientX >= rect.right - kEdgeSize;
        const nearTop = e.clientY >= rect.top && e.clientY <= rect.top + kEdgeSize;
        const nearBottom = e.clientY <= rect.bottom && e.clientY >= rect.bottom - kEdgeSize;

        if (nearTop && nearLeft)
            return kResizeTopLeft;

        if (nearTop && nearRight)
            return kResizeTopRight;

        if (nearBottom && nearLeft)
            return kResizeBottomLeft;

        if (nearBottom && nearRight)
            return kResizeBottomRight;

        if (nearLeft)
            return kResizeLeft;

        if (nearRight)
            return kResizeRight;

        if (nearTop)
            return kResizeTop;

        if (nearBottom)
            return kResizeBottom;

        return kResizeNone;
    }

    function handleWindowMouseDown(e) {
        if (e.button !== 0)
            return;

        desktop.bringToFront(win.id);
        refresh();

        if (e.target.closest(".xwindow-titlebar"))
            return;

        const dir = getResizeDirection(e);
        if (!dir)
            return;

        resizeRef.current = {
            dir,
            startMouseX: e.clientX,
            startMouseY: e.clientY,
            startX: win.x,
            startY: win.y,
            startWidth: win.width,
            startHeight: win.height
        };

        window.addEventListener("mousemove", handleResizeMouseMove);
        window.addEventListener("mouseup", handleResizeMouseUp);

        e.preventDefault();
    }

    function handleResizeMouseMove(e) {
        const resize = resizeRef.current;
        if (!resize)
            return;

        const dx = e.clientX - resize.startMouseX;
        const dy = e.clientY - resize.startMouseY;

        let newX = resize.startX;
        let newY = resize.startY;
        let newWidth = resize.startWidth;
        let newHeight = resize.startHeight;

        if (resize.dir.includes("right"))
            newWidth = Math.max(kMinWidth, resize.startWidth + dx);

        if (resize.dir.includes("bottom"))
            newHeight = Math.max(kMinHeight, resize.startHeight + dy);

        if (resize.dir.includes("left")) {
            const maxX = resize.startX + resize.startWidth - kMinWidth;
            newX = Math.min(resize.startX + dx, maxX);
            newWidth = resize.startWidth - (newX - resize.startX);
        }

        if (resize.dir.includes("top")) {
            const maxY = resize.startY + resize.startHeight - kMinHeight;
            newY = Math.min(resize.startY + dy, maxY);
            newHeight = resize.startHeight - (newY - resize.startY);
        }

        win.x = newX;
        win.y = newY;
        win.width = newWidth;
        win.height = newHeight;

        refresh();
    }

    function handleResizeMouseUp() {
        resizeRef.current = null;
        window.removeEventListener("mousemove", handleResizeMouseMove);
        window.removeEventListener("mouseup", handleResizeMouseUp);
    }

    function handleWindowMouseMove(e) {
        const dir = getResizeDirection(e);

        const map = {
            [kResizeLeft]: "ew-resize",
            [kResizeRight]: "ew-resize",
            [kResizeTop]: "ns-resize",
            [kResizeBottom]: "ns-resize",
            [kResizeTopLeft]: "nwse-resize",
            [kResizeBottomRight]: "nwse-resize",
            [kResizeTopRight]: "nesw-resize",
            [kResizeBottomLeft]: "nesw-resize",
            [kResizeNone]: "default"
        };

        e.currentTarget.style.cursor = map[dir];
    }

    function handleWindowMouseLeave(e) {
        if (!resizeRef.current && !dragRef.current)
            e.currentTarget.style.cursor = "default";
    }

    const style = {
        left: `${win.x}px`,
        top: `${win.y}px`,
        width: `${win.width}px`,
        height: `${win.height}px`
    };

    return (
        <section
            className={`xwindow${win.active ? " active" : ""}`}
            style={style}
            onMouseDown={handleWindowMouseDown}
            onMouseMove={handleWindowMouseMove}
            onMouseLeave={handleWindowMouseLeave}
        >
            <header className="xwindow-titlebar" onMouseDown={handleTitleMouseDown}>
                <div className="xwindow-title">
                    <img
                        className="xwindow-title-icon"
                        src={win.icon || "/images/Generic.png"}
                        alt=""
                        draggable="false"
                    />

                    <span>{win.title}</span>
                </div>

                <div className="xwindow-controls">
                    <button
                        type="button"
                        className="xwindow-control-btn"
                        onMouseDown={e => e.stopPropagation()}
                    >
                        <img src="/images/minimize.svg" alt="" draggable="false" />
                    </button>

                    <button
                        type="button"
                        className="xwindow-control-btn"
                        onMouseDown={e => e.stopPropagation()}
                    >
                        <img src="/images/restore.svg" alt="" draggable="false" />
                    </button>

                    <button
                        type="button"
                        className="xwindow-control-btn close"
                        onMouseDown={e => e.stopPropagation()}
                        onClick={handleClose}
                    >
                        <img src="/images/close.svg" alt="" draggable="false" />
                    </button>
                </div>
            </header>

            <div className="xwindow-body"></div>
        </section>
    );
}