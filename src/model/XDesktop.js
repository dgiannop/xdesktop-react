import { XWindow } from "./XWindow.js";
import { XItem, XItemType } from "./XItem.js";
import { XView } from "./XView.js";
import { XStore } from "./XStore.js";

export class XDesktop {
    constructor() {
        this.store = new XStore();

        const items = [
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

        this.view = new XView(items);
        this.windows = [];
    }

    notify() {
        this.store.notify();
    }

    addItem(item) {
        this.view.items.push(item);
        this.notify();
    }

    addWindow(win) {
        win.zIndex = (this._zCounter = (this._zCounter ?? 1) + 1);
        this.windows.push(win);
        this.bringToFront(win.id);
    }

    removeClosedWindows() {
        this.windows = this.windows.filter(w => !w.closed);
        this.notify();
    }

    deactivateAllWindows() {
        for (const w of this.windows)
            w.active = false;

        this.notify();
    }

    bringToFront(windowId) {
        for (const w of this.windows)
            w.active = false;

        const win = this.windows.find(w => w.id === windowId);
        if (!win)
            return;

        win.active = true;
        win.zIndex = (this._zCounter = (this._zCounter ?? 1) + 1);

        this.notify();
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
