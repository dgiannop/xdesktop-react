import { useEffect, useState } from "react";

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

export default function Taskbar({ desktop }) {
    const [clockText, setClockText] = useState(formatClock);

    useEffect(() => {
        const timerId = setInterval(() => {
            setClockText(formatClock());
        }, 3000);

        return () => {
            clearInterval(timerId);
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

    return (
        <>
            <button className="start-btn" type="button">
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
                                src={win.icon || "/images/Generic.png"}
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
                <button className="tb-icon" type="button">
                    <img src="/images/menu.svg" alt="" draggable="false" />
                </button>

                <div className="clock">
                    {clockText}
                </div>
            </div>
        </>
    );
}
