const kPrimaryItems = [
    { id: "home", label: "Home Folder", icon: "/images/Home Folder.png" },
    { id: "documents", label: "Documents", icon: "/images/Documents.png" },
    { id: "pictures", label: "Pictures", icon: "/images/Pictures.png" },
    { id: "video", label: "Video", icon: null },
    { id: "music", label: "Music", icon: null },
    { id: "sync", label: "Sync", icon: null },
    { id: "public", label: "Public", icon: null }
];

const kSecondaryItems = [
    { id: "settings", label: "Settings" },
    { id: "logoff", label: "Log Off" }
];

export default function StartMenu({ open, onClose }) {
    if (!open)
        return null;

    function handleOverlayMouseDown() {
        onClose();
    }

    function handlePanelMouseDown(e) {
        e.stopPropagation();
    }

    function handleMenuItemClick() {
        onClose();
    }

    return (
        <div className="start-menu-overlay" onMouseDown={handleOverlayMouseDown}>
            <section className="start-menu" onMouseDown={handlePanelMouseDown}>
                <div className="start-menu-header">
                    <img
                        className="start-menu-user-image"
                        src="/images/dan.jpg"
                        alt=""
                        draggable="false"
                    />

                    <div className="start-menu-user-name">
                        Administrator
                    </div>
                </div>

                <div className="start-menu-body">
                    <div className="start-menu-left-panel" />

                    <nav className="start-menu-right-panel">
                        <div className="start-menu-items">
                            {kPrimaryItems.map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className="start-menu-item"
                                    onClick={handleMenuItemClick}
                                >
                                    {item.icon ? (
                                        <img
                                            className="start-menu-item-icon"
                                            src={item.icon}
                                            alt=""
                                            draggable="false"
                                        />
                                    ) : (
                                        <span className="start-menu-item-icon-placeholder" />
                                    )}

                                    <span className="start-menu-item-label">
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="start-menu-spacer" />

                        <div className="start-menu-items secondary">
                            {kSecondaryItems.map(item => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className="start-menu-item"
                                    onClick={handleMenuItemClick}
                                >
                                    <span className="start-menu-item-icon-placeholder" />
                                    <span className="start-menu-item-label">
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </nav>
                </div>

                <div className="start-menu-search-row">
                    <input
                        className="start-menu-search"
                        type="text"
                        placeholder="Search"
                    />
                </div>
            </section>
        </div>
    );
}
