import { XWindow } from "./XWindow.js";
import { XItem, XItemType } from "./XItem.js";

export class XDesktop {
    constructor() {
        this.items = [
            new XItem("Documents", XItemType.FOLDER, "", "/images/Documents.png"),
            new XItem("Pictures", XItemType.FOLDER, "", "/images/Pictures.png"),
            new XItem("Music", XItemType.FOLDER, "", "/images/Music.png"),
            new XItem("Videos", XItemType.FOLDER, "", "/images/Videos.png"),
            new XItem("Public", XItemType.FOLDER, "", "/images/Public.png"),
            new XItem("Sync", XItemType.FOLDER, "", "/images/sync.png"),
            new XItem("Home", XItemType.FOLDER, "", "/images/Home.png"),
            new XItem("Applications", XItemType.FOLDER, "", "/images/Applications.png"),
            new XItem("Desktop", XItemType.FOLDER, "", "/images/Desktop.png"),
            new XItem("Trash", XItemType.FOLDER, "", "/images/trash.png")
        ];

        this.windows = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    addWindow(win) {
        this.windows.push(win);
        this.bringToFront(win.id);
    }

    removeClosedWindows() {
        this.windows = this.windows.filter(w => !w.closed);
    }

    bringToFront(windowId) {
        const idx = this.windows.findIndex(w => w.id === windowId);
        if (idx < 0)
            return;

        const win = this.windows[idx];
        this.windows.splice(idx, 1);
        this.windows.push(win);

        for (const w of this.windows)
            w.active = false;

        win.active = true;
    }

    openFolder(item) {
        const win = new XWindow(item.title, "folder", item.icon || "/images/Generic.png");
        this.addWindow(win);
    }

    openApp(item) {
        const win = new XWindow(item.title, "app", item.icon || "/images/react.png");
        this.addWindow(win);
    }
}