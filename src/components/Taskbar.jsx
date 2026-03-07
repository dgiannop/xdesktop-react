import { useEffect, useState } from "react";

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

export default function Taskbar() {
    const [clockText, setClockText] = useState(formatClock);

    useEffect(() => {
        const timerId = setInterval(() => {
            setClockText(formatClock());
        }, 3000);

        setClockText(formatClock());

        return () => {
            console.log("cleanup called");
            clearInterval(timerId);
        };
    }, []);

    return (
        <>
            <button className="start-btn" type="button">Start</button>

            <div className="taskbar-center"></div>

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