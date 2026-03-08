import { XItemType, XItemOwner } from "./XItem.js";
import { XEntry } from "./XEntry.js";

export class XFolder extends XEntry {
    constructor(title = "", path = "", icon = "", owner = XItemOwner.USER) {
        super(title, XItemType.FOLDER, path, icon, owner);
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    removeItemById(itemId) {
        const index = this.items.findIndex(item => item.id === itemId);
        if (index >= 0)
            this.items.splice(index, 1);
    }

    findItemById(itemId) {
        return this.items.find(item => item.id === itemId) ?? null;
    }
}
