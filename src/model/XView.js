export class XView {
    constructor(items = []) {
        this.items = items;
        this.selectedItemId = null;
    }

    clearSelection() {
        this.selectedItemId = null;
    }

    selectItem(itemId) {
        this.selectedItemId = itemId;
    }

    isSelected(itemId) {
        return this.selectedItemId === itemId;
    }
}
