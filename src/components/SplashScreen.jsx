export default function SplashScreen({ open, onClose }) {
    if (!open)
        return null;

    function handleOverlayMouseDown() {
        onClose();
    }

    function handlePanelMouseDown(e) {
        e.stopPropagation();
    }

    function handleRepoClick(e) {
        e.preventDefault();
        window.open("https://github.com/dgiannop/xdesktop-react", "_blank", "noopener,noreferrer");
        onClose();
    }

    return (
        <div className="splash-overlay" onMouseDown={handleOverlayMouseDown}>
            <section className="splash-panel" onMouseDown={handlePanelMouseDown}>
                <img
                    className="splash-logo"
                    src="images/react.svg"
                    alt=""
                    draggable="false"
                />

                <h1 className="splash-title">XDesktop</h1>

                <p className="splash-text">
                    XDesktop is a desktop-style web application built with React and Vite,
                    featuring draggable windows, folders, context menus, a taskbar, a start
                    menu, and a virtual filesystem. The original concept also connected to
                    cloud services for user accounts, folder structures, and file storage.
                </p>

                <a
                    className="splash-link"
                    href="https://github.com/dgiannop/xdesktop-react"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleRepoClick}
                >
                    github.com/dgiannop/xdesktop-react
                </a>
            </section>
        </div>
    );
}
