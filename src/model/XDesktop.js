import { XWindow } from "./XWindow.js";
import { XItem, XItemType, XItemOwner } from "./XItem.js";
import { XView } from "./XView.js";
import { XStore } from "./XStore.js";
import { XFilesystem } from "./XFilesystem.js";
import { XFolder } from "./XFolder.js";
import { XContextMenu } from "./XContextMenu.js";

export class XDesktop {
    constructor() {
        this.store = new XStore();
        this.fs = new XFilesystem();
        this.contextMenu = new XContextMenu();
        this._zCounter = 1;
        this._newFolderCounter = 1;
        this._newFileCounter = 1;

        this.dragItem = null;
        this.dragSourcePath = "";

        const items = [
            new XItem("Documents", XItemType.FOLDER, "Documents", "/images/Documents.png", XItemOwner.SYSTEM),
            new XItem("Pictures", XItemType.FOLDER, "Pictures", "/images/Pictures.png", XItemOwner.SYSTEM),
            new XItem("Music", XItemType.FOLDER, "Music", "/images/Music.png", XItemOwner.SYSTEM),
            new XItem("Videos", XItemType.FOLDER, "Videos", "/images/Videos.png", XItemOwner.SYSTEM),
            new XItem("Public", XItemType.FOLDER, "Public", "/images/Public.png", XItemOwner.SYSTEM),
            new XItem("Sync", XItemType.FOLDER, "Sync", "/images/sync.png", XItemOwner.SYSTEM),
            new XItem("Home", XItemType.FOLDER, "Home", "/images/Home.png", XItemOwner.SYSTEM),
            new XItem("Applications", XItemType.FOLDER, "Applications", "/images/Applications.png", XItemOwner.SYSTEM),
            new XItem("Desktop", XItemType.FOLDER, "Desktop", "/images/Desktop.png", XItemOwner.SYSTEM),
            new XItem("Trash", XItemType.FOLDER, "Trash", "/images/trash.png", XItemOwner.SYSTEM)
        ];

        this.view = new XView(items, "");
        this.windows = [];

        const documents = new XFolder("Documents", "Documents", "/images/Documents.png", XItemOwner.SYSTEM);
        documents.addItem(new XItem("Notes.txt", XItemType.ITEM, "Documents/Notes.txt", "/images/Generic.png"));
        documents.addItem(new XItem("Resume.txt", XItemType.ITEM, "Documents/Resume.txt", "/images/Generic.png"));

        const pictures = new XFolder("Pictures", "Pictures", "/images/Pictures.png", XItemOwner.SYSTEM);
        pictures.addItem(new XItem("Photo 1", XItemType.ITEM, "Pictures/Photo1", "/images/Generic.png"));
        pictures.addItem(new XItem("Photo 2", XItemType.ITEM, "Pictures/Photo2", "/images/Generic.png"));

        const music = new XFolder("Music", "Music", "/images/Music.png", XItemOwner.SYSTEM);
        const videos = new XFolder("Videos", "Videos", "/images/Videos.png", XItemOwner.SYSTEM);
        const pub = new XFolder("Public", "Public", "/images/Public.png", XItemOwner.SYSTEM);
        const sync = new XFolder("Sync", "Sync", "/images/sync.png", XItemOwner.SYSTEM);
        const home = new XFolder("Home", "Home", "/images/Home.png", XItemOwner.SYSTEM);
        const desktopFolder = new XFolder("Desktop", "Desktop", "/images/Desktop.png", XItemOwner.SYSTEM);
        const trash = new XFolder("Trash", "Trash", "/images/trash.png", XItemOwner.SYSTEM);

        const applications = new XFolder("Applications", "Applications", "/images/Applications.png", XItemOwner.SYSTEM);
        applications.addItem(new XItem("Calculator", XItemType.APP, "Applications/Calculator", "/images/react.png"));
        applications.addItem(new XItem("Editor", XItemType.APP, "Applications/Editor", "/images/react.png"));

        this.fs.addFolder(documents);
        this.fs.addFolder(pictures);
        this.fs.addFolder(music);
        this.fs.addFolder(videos);
        this.fs.addFolder(pub);
        this.fs.addFolder(sync);
        this.fs.addFolder(home);
        this.fs.addFolder(applications);
        this.fs.addFolder(desktopFolder);
        this.fs.addFolder(trash);
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
        win.minimized = false;
        win.zIndex = ++this._zCounter;

        this.notify();
    }

    getFolderItems(path) {
        return this.fs.getFolderItems(path);
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

        win.view.path = item.path;
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

    createFolder(parentPath, name, icon = "/images/Generic.png", owner = XItemOwner.USER) {
        const path = parentPath ? `${parentPath}/${name}` : name;

        const folder = new XFolder(name, path, icon, owner);
        this.fs.addFolder(folder);

        const item = new XItem(name, XItemType.FOLDER, path, icon, owner);

        if (!parentPath)
            this.view.items.push(item);
        else
            this.fs.addItemToFolder(parentPath, item);

        this.notify();
        return item;
    }

    createFile(parentPath, name, icon = "/images/Generic.png", owner = XItemOwner.USER) {
        const path = parentPath ? `${parentPath}/${name}` : name;
        const item = new XItem(name, XItemType.ITEM, path, icon, owner);

        if (!parentPath)
            this.view.items.push(item);
        else
            this.fs.addItemToFolder(parentPath, item);

        this.notify();
        return item;
    }

    beginDrag(item, sourcePath) {
        if (!item)
            return false;

        this.dragItem = item;
        this.dragSourcePath = sourcePath ?? "";
        this.notify();
        return true;
    }

    clearDrag() {
        this.dragItem = null;
        this.dragSourcePath = "";
        this.notify();
    }

    moveDraggedItem(targetPath) {
        if (!this.dragItem)
            return false;

        const ok = this.moveItem(this.dragItem, this.dragSourcePath, targetPath ?? "");
        this.clearDrag();
        return ok;
    }

    moveItem(item, fromPath, toPath) {
        if (!item)
            return false;

        if (item.owner === XItemOwner.SYSTEM)
            return false;

        const srcPath = fromPath ?? "";
        const dstPath = toPath ?? "";

        if (srcPath === dstPath)
            return false;

        if (item.type === XItemType.FOLDER) {
            if (dstPath === item.path)
                return false;

            if (dstPath.startsWith(`${item.path}/`))
                return false;
        }

        this.removeItemFromContainer(item.id, srcPath);

        const oldPath = item.path;
        const newPath = dstPath ? `${dstPath}/${this.getLeafName(oldPath)}` : this.getLeafName(oldPath);

        item.path = newPath;

        if (!dstPath)
            this.view.items.push(item);
        else
            this.fs.addItemToFolder(dstPath, item);

        if (item.type === XItemType.FOLDER) {
            this.renameFolderPath(oldPath, newPath);
            this.updateChildPaths(oldPath, newPath);
            this.updateOpenViewsForPath(oldPath, newPath);
        }

        this.notify();
        return true;
    }

    removeItemFromContainer(itemId, containerPath) {
        if (!containerPath) {
            this.view.items = this.view.items.filter(item => item.id !== itemId);
            return;
        }

        const folder = this.fs.getFolder(containerPath);
        if (!folder)
            return;

        folder.removeItemById(itemId);
    }

    buildViewContextMenu(view) {
        const basePath = view?.path ?? "";

        return [
            {
                label: "Add New Folder",
                action: () => {
                    const item = this.createFolder(basePath, `New Folder ${this._newFolderCounter++}`);
                    view.selectItem(item.id);
                    view.beginEditItem(item.id);
                    this.notify();
                }
            },
            {
                label: "Add New File",
                action: () => {
                    const item = this.createFile(basePath, `New File ${this._newFileCounter++}.txt`);
                    view.selectItem(item.id);
                    view.beginEditItem(item.id);
                    this.notify();
                }
            }
        ];
    }

    buildItemContextMenu(item, view) {
        const menuItems = [
            {
                label: "Open",
                action: () => item.activate(this)
            }
        ];

        if (item.owner !== XItemOwner.SYSTEM) {
            menuItems.push({
                label: `Rename ${item.title}`,
                action: () => {
                    view.selectItem(item.id);
                    view.beginEditItem(item.id);
                    this.notify();
                }
            });

            menuItems.push({
                label: `Delete ${item.title}`,
                action: () => {
                    if (view.isSelected(item.id))
                        view.clearSelection();

                    if (view.isEditing(item.id))
                        view.endEditItem();

                    this.deleteItem(item);
                }
            });
        }

        menuItems.push({
            label: "Copy",
            action: () => { }
        });

        if (item.type === XItemType.FOLDER) {
            menuItems.push({
                label: `Compress ${item.title}`,
                action: () => { }
            });
        }

        menuItems.push({
            label: "Properties",
            action: () => { }
        });

        return menuItems;
    }

    renameItem(item, newTitle) {
        if (!item)
            return false;

        if (item.owner === XItemOwner.SYSTEM)
            return false;

        const trimmed = (newTitle ?? "").trim();
        if (!trimmed)
            return false;

        const oldPath = item.path;
        const parentPath = this.getParentPath(oldPath);
        const newPath = parentPath ? `${parentPath}/${trimmed}` : trimmed;

        item.title = trimmed;
        item.path = newPath;

        if (item.type === XItemType.FOLDER) {
            this.renameFolderPath(oldPath, newPath);
            this.updateChildPaths(oldPath, newPath);
            this.updateOpenViewsForPath(oldPath, newPath);
        }

        this.notify();
        return true;
    }

    getParentPath(path) {
        if (!path)
            return "";

        const idx = path.lastIndexOf("/");
        return idx >= 0 ? path.slice(0, idx) : "";
    }

    renameFolderPath(oldPath, newPath) {
        const folder = this.fs.getFolder(oldPath);
        if (!folder)
            return;

        this.fs.folders.delete(oldPath);
        folder.path = newPath;
        folder.title = this.getLeafName(newPath);
        this.fs.folders.set(newPath, folder);
    }

    updateChildPaths(oldPrefix, newPrefix) {
        for (const folder of this.fs.folders.values()) {
            for (const child of folder.items) {
                if (child.path === oldPrefix || child.path.startsWith(`${oldPrefix}/`))
                    child.path = newPrefix + child.path.slice(oldPrefix.length);
            }
        }

        for (const [path, folder] of Array.from(this.fs.folders.entries())) {
            if (path === oldPrefix)
                continue;

            if (path.startsWith(`${oldPrefix}/`)) {
                this.fs.folders.delete(path);

                const updatedPath = newPrefix + path.slice(oldPrefix.length);
                folder.path = updatedPath;

                this.fs.folders.set(updatedPath, folder);
            }
        }
    }

    updateOpenViewsForPath(oldPath, newPath) {
        for (const win of this.windows) {
            if (!win?.view)
                continue;

            if (win.view.path === oldPath)
                win.view.path = newPath;
        }
    }

    getLeafName(path) {
        if (!path)
            return "";

        const idx = path.lastIndexOf("/");
        return idx >= 0 ? path.slice(idx + 1) : path;
    }

    deleteItem(item) {
        if (!item)
            return false;

        if (item.owner === XItemOwner.SYSTEM)
            return false;

        if (item.type === XItemType.FOLDER)
            this.deleteFolderRecursive(item.path);

        this.removeItemFromDesktop(item.id);
        this.removeItemFromAllFolders(item.id);
        this.closeWindowsForPath(item.path);

        this.notify();
        return true;
    }

    deleteFolderRecursive(folderPath) {
        const childItems = this.getFolderItems(folderPath);

        for (const child of childItems) {
            if (child.type === XItemType.FOLDER)
                this.deleteFolderRecursive(child.path);
        }

        this.fs.folders.delete(folderPath);
    }

    removeItemFromDesktop(itemId) {
        this.view.items = this.view.items.filter(item => item.id !== itemId);
    }

    removeItemFromAllFolders(itemId) {
        for (const folder of this.fs.folders.values()) {
            folder.removeItemById(itemId);
        }
    }

    closeWindowsForPath(path) {
        for (const win of this.windows) {
            if (!win?.view)
                continue;

            if (win.view.path === path)
                win.close();
        }

        this.removeClosedWindows();
    }
}
