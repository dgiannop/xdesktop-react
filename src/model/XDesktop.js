import { XWindow } from "./XWindow.js";
import { XItem, XItemType } from "./XItem.js";
import { XView } from "./XView.js";
import { XStore } from "./XStore.js";

export class XDesktop {
    constructor() {
        this.store = new XStore();
        this._zCounter = 1;

        const items = [
            new XItem("Documents", XItemType.FOLDER, "Documents", "/images/Documents.png"),
            new XItem("Pictures", XItemType.FOLDER, "Pictures", "/images/Pictures.png"),
            new XItem("Music", XItemType.FOLDER, "Music", "/images/Music.png"),
            new XItem("Videos", XItemType.FOLDER, "Videos", "/images/Videos.png"),
            new XItem("Public", XItemType.FOLDER, "Public", "/images/Public.png"),
            new XItem("Sync", XItemType.FOLDER, "Sync", "/images/sync.png"),
            new XItem("Home", XItemType.FOLDER, "Home", "/images/Home.png"),
            new XItem("Applications", XItemType.FOLDER, "Applications", "/images/Applications.png"),
            new XItem("Desktop", XItemType.FOLDER, "Desktop", "/images/Desktop.png"),
            new XItem("Trash", XItemType.FOLDER, "Trash", "/images/trash.png")
        ];

        this.view = new XView(items);
        this.windows = [];

        this.folders = {
            Documents: [
                new XItem("Notes.txt", XItemType.ITEM, "Documents/Notes.txt", "/images/Generic.png"),
                new XItem("Resume.txt", XItemType.ITEM, "Documents/Resume.txt", "/images/Generic.png")
            ],

            Pictures: [
                new XItem("Photo 1", XItemType.ITEM, "Pictures/Photo1", "/images/Generic.png"),
                new XItem("Photo 2", XItemType.ITEM, "Pictures/Photo2", "/images/Generic.png")
            ],

            Applications: [
                new XItem("Calculator", XItemType.APP, "Applications/Calculator", "/images/react.png"),
                new XItem("Editor", XItemType.APP, "Applications/Editor", "/images/react.png")
            ]
        };
    }

    notify() {
        this.store.notify();
    }

    addItem(item) {
        this.view.items.push(item);
        this.notify();
    }

    addWindow(win) {
        win.zIndex = ++this._zCounter;
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
        win.zIndex = ++this._zCounter;

        this.notify();
    }

    getFolderItems(path) {
        return this.folders[path] ?? [];
    }

    openItem(item) {
        switch (item.type) {
            case XItemType.FOLDER:
                this.openFolder(item);
                break;

            case XItemType.APP:
                this.openApp(item);
                break;

            default:
                break;
        }
    }

    openFolder(item) {
        const win = new XWindow(
            item.title,
            XItemType.FOLDER,
            item.icon || "/images/Generic.png"
        );

        win.view.items = this.getFolderItems(item.path);
        this.addWindow(win);
    }

    openApp(item) {
        const win = new XWindow(
            item.title,
            XItemType.APP,
            item.icon || "/images/react.png"
        );

        this.addWindow(win);
    }
}
