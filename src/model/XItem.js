export const XItemType = Object.freeze({
    ITEM: "item",
    FOLDER: "folder",
    APP: "app"
});

export class XItem {
    static _nextId = 1;

    constructor(title = "", type = XItemType.ITEM, path = "", icon = "") {
        this.id = XItem._nextId++;
        this.title = title;
        this.type = type;
        this.path = path;
        this.icon = icon;
    }

    activate(desktop) {
        if (!desktop)
            return;

        desktop.openItem(this);
    }
}
