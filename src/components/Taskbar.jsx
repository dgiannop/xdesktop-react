import { useEffect, useRef, useState } from "react";

const kTaskbarTabWidth = 140;

function formatClock() {
    const now = new Date();

    const day = now.toLocaleDateString(undefined, {
        weekday: "short"
    });

    const time = now.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit"
    });

    return `${day} ${time}`;
}

export default function Taskbar({ desktop, startMenuOpen, onToggleStartMenu }) {
    const [clockText, setClockText] = useState(formatClock);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const timerId = setInterval(() => {
            setClockText(formatClock());
        }, 3000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    useEffect(() => {
        function handleMouseDown(e) {
            if (!menuRef.current)
                return;

            if (menuRef.current.contains(e.target))
                return;

            setMenuOpen(false);
        }

        function handleKeyDown(e) {
            if (e.key === "Escape")
                setMenuOpen(false);
        }

        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    function handleWindowTabClick(win) {
        if (win.minimized) {
            win.minimized = false;
            desktop.bringToFront(win.id);
            return;
        }

        if (!win.active) {
            desktop.bringToFront(win.id);
            return;
        }

        win.minimized = true;
        desktop.notify();
    }

    function handleCenterWindows() {
        setMenuOpen(false);
        desktop.centerWindows();
    }

    function handleToggleFullscreen() {
        setMenuOpen(false);
        desktop.toggleFullscreen();
    }

    return (
        <>
            <button
                className={`start-btn${startMenuOpen ? " active" : ""}`}
                type="button"
                onClick={onToggleStartMenu}
            >
                Start
            </button>

            <div className="taskbar-window-tabs">
                {desktop.windows
                    .filter(win => !win.closed)
                    .map(win => (
                        <button
                            key={win.id}
                            type="button"
                            className={`taskbar-window-tab${win.active && !win.minimized ? " active" : ""}${win.minimized ? " minimized" : ""}`}
                            onClick={() => handleWindowTabClick(win)}
                            style={{
                                width: `${kTaskbarTabWidth}px`,
                                minWidth: `${kTaskbarTabWidth}px`,
                                maxWidth: `${kTaskbarTabWidth}px`
                            }}
                        >
                            <img
                                className="taskbar-window-tab-icon"
                                src={win.icon || "images/Generic.png"}
                                alt=""
                                draggable="false"
                            />

                            <span className="taskbar-window-tab-title">
                                {win.title}
                            </span>
                        </button>
                    ))}
            </div>

            <div className="taskbar-right">
                <div
                    ref={menuRef}
                    className={`taskbar-menu-button${menuOpen ? " active" : ""}`}
                >
                    <button
                        className="tb-icon"
                        type="button"
                        onClick={() => setMenuOpen(prev => !prev)}
                    >
                        <img src="images/menu.svg" alt="" draggable="false" />
                    </button>

                    <div className="taskbar-popup-menu">
                        <button
                            type="button"
                            className="taskbar-popup-item"
                            onClick={handleCenterWindows}
                        >
                            Center Windows
                        </button>

                        <button
                            type="button"
                            className="taskbar-popup-item"
                            onClick={handleToggleFullscreen}
                        >
                            Toggle Fullscreen
                        </button>
                    </div>
                </div>

                <div className="clock">
                    {clockText}
                </div>
            </div>
        </>
    );
}
