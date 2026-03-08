export class XFilesystem {
    constructor() {
        this.folders = new Map();
    }

    addFolder(folder) {
        this.folders.set(folder.path, folder);
    }

    getFolder(path) {
        return this.folders.get(path) ?? null;
    }

    getFolderItems(path) {
        const folder = this.getFolder(path);
        return folder ? folder.items : [];
    }

    addItemToFolder(path, item) {
        const folder = this.getFolder(path);
        if (!folder)
            return false;

        folder.addItem(item);
        return true;
    }
}
