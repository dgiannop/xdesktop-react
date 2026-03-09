export const XItemType = Object.freeze({
    ITEM: "item",
    FOLDER: "folder",
    APP: "app"
});

export const XItemOwner = Object.freeze({
    USER: "user",
    SYSTEM: "system"
});

export class XItem {
    static _nextId = 1;

    constructor(
        title = "",
        type = XItemType.ITEM,
        path = "",
        icon = "",
        owner = XItemOwner.USER,
        content = ""
    ) {
        this.id = XItem._nextId++;
        this.title = title;
        this.type = type;
        this.path = path;
        this.icon = icon;
        this.owner = owner;
        this.content = content;
    }

    activate(desktop) {
        if (!desktop)
            return;

        desktop.openItem(this);
    }
}
