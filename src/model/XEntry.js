import { XItem, XItemType, XItemOwner } from "./XItem.js";

export class XEntry extends XItem {
    constructor(
        title = "",
        type = XItemType.ITEM,
        path = "",
        icon = "",
        owner = XItemOwner.USER
    ) {
        super(title, type, path, icon, owner);
    }
}
