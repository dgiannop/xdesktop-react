import { useRef } from "react";
import { XItemType } from "../model/XItem.js";
import XView from "./XView.jsx";

const kMinWidth = 240;
const kMinHeight = 140;
const kTaskbarHeight = 36;

export default function XWindow({ win, desktop }) {
    const dragRef = useRef(null);
    const resizeRef = useRef(null);

    function handleClose() {
        win.close();
        desktop.removeClosedWindows();
    }

    function handleMinimize() {
        win.minimized = true;
        desktop.notify();
    }

    function handleToggleMaximize() {
        if (!win.maximized) {
            win.restoreX = win.x;
            win.restoreY = win.y;
            win.restoreWidth = win.width;
            win.restoreHeight = win.height;

            win.x = 0;
            win.y = 0;
            win.width = window.innerWidth;
            win.height = window.innerHeight - kTaskbarHeight;
            win.maximized = true;
        }
        else {
            win.x = win.restoreX ?? 80;
            win.y = win.restoreY ?? 80;
            win.width = win.restoreWidth ?? 480;
            win.height = win.restoreHeight ?? 320;
            win.maximized = false;
        }

        desktop.notify();
    }

    function activateWindow() {
        desktop.bringToFront(win.id);
    }

    function handleTitleMouseDown(e) {
        if (e.button !== 0)
            return;

        if (e.target.closest(".xwindow-controls"))
            return;

        if (win.maximized)
            return;

        activateWindow();

        dragRef.current = {
            startMouseX: e.clientX,
            startMouseY: e.clientY,
            startX: win.x,
            startY: win.y
        };

        window.addEventListener("mousemove", handleDragMouseMove);
        window.addEventListener("mouseup", handleDragMouseUp);

        e.preventDefault();
    }

    function handleDragMouseMove(e) {
        const drag = dragRef.current;
        if (!drag)
            return;

        const dx = e.clientX - drag.startMouseX;
        const dy = e.clientY - drag.startMouseY;

        win.moveTo(drag.startX + dx, drag.startY + dy);
        desktop.notify();
    }

    function handleDragMouseUp() {
        dragRef.current = null;
        window.removeEventListener("mousemove", handleDragMouseMove);
        window.removeEventListener("mouseup", handleDragMouseUp);
    }

    function beginResize(e, dir) {
        if (e.button !== 0)
            return;

        if (win.maximized)
            return;

        activateWindow();

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
        e.stopPropagation();
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

        desktop.notify();
    }

    function handleResizeMouseUp() {
        resizeRef.current = null;
        window.removeEventListener("mousemove", handleResizeMouseMove);
        window.removeEventListener("mouseup", handleResizeMouseUp);
    }

    function handleTextChange(e) {
        if (!win.fileItem)
            return;

        win.fileItem.content = e.target.value;
        desktop.notify();
    }

    function renderClient() {
        switch (win.type) {
            case XItemType.FOLDER:
                return (
                    <XView
                        view={win.view}
                        desktop={desktop}
                        onActivate={activateWindow}
                    />
                );

            case XItemType.APP:
                return (
                    <div className="xwindow-app-content">
                        {win.title}
                    </div>
                );

            case XItemType.ITEM:
                return (
                    <textarea
                        className="xwindow-notepad"
                        value={win.fileItem?.content ?? ""}
                        onChange={handleTextChange}
                        spellCheck={false}
                    />
                );

            default:
                return (
                    <XView
                        view={win.view}
                        desktop={desktop}
                        onActivate={activateWindow}
                    />
                );
        }
    }

    const style = {
        left: `${win.x}px`,
        top: `${win.y}px`,
        width: `${win.width}px`,
        height: `${win.height}px`,
        zIndex: win.zIndex
    };

    return (
        <section
            className={`xwindow${win.active ? " active" : ""}${win.maximized ? " maximized" : ""}`}
            style={style}
            onMouseDown={() => {
                activateWindow();
            }}
        >
            {!win.maximized && (
                <>
                    <div className="xwindow-resize-handle top" onMouseDown={(e) => beginResize(e, "top")} />
                    <div className="xwindow-resize-handle right" onMouseDown={(e) => beginResize(e, "right")} />
                    <div className="xwindow-resize-handle bottom" onMouseDown={(e) => beginResize(e, "bottom")} />
                    <div className="xwindow-resize-handle left" onMouseDown={(e) => beginResize(e, "left")} />

                    <div className="xwindow-resize-handle top-left" onMouseDown={(e) => beginResize(e, "top-left")} />
                    <div className="xwindow-resize-handle top-right" onMouseDown={(e) => beginResize(e, "top-right")} />
                    <div className="xwindow-resize-handle bottom-right" onMouseDown={(e) => beginResize(e, "bottom-right")} />
                    <div className="xwindow-resize-handle bottom-left" onMouseDown={(e) => beginResize(e, "bottom-left")} />
                </>
            )}

            <header
                className="xwindow-titlebar"
                onMouseDown={handleTitleMouseDown}
                onDoubleClick={handleToggleMaximize}
            >
                <div className="xwindow-title">
                    <img
                        className="xwindow-title-icon"
                        src={win.icon || "/images/Generic.png"}
                        alt=""
                        draggable="false"
                    />
                    <span className="title-content">{win.title}</span>
                </div>

                <div className="xwindow-controls">
                    <button
                        type="button"
                        className="xwindow-control-btn"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={handleMinimize}
                    >
                        <img src="/images/minimize.svg" alt="" draggable="false" />
                    </button>

                    <button
                        type="button"
                        className="xwindow-control-btn"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={handleToggleMaximize}
                    >
                        <img
                            src={win.maximized ? "/images/restore.svg" : "/images/maximize.svg"}
                            alt=""
                            draggable="false"
                        />
                    </button>

                    <button
                        type="button"
                        className="xwindow-control-btn close"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={handleClose}
                    >
                        <img src="/images/close.svg" alt="" draggable="false" />
                    </button>
                </div>
            </header>

            <div className="xwindow-client">
                {renderClient()}
            </div>
        </section>
    );
}
