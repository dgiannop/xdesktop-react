export class XView {
    constructor(items = [], path = "") {
        this.items = Array.isArray(items) ? items : [];
        this.path = path;
        this.selectedItemId = null;
        this.editingItemId = null;
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

    beginEditItem(itemId) {
        this.editingItemId = itemId;
    }

    endEditItem() {
        this.editingItemId = null;
    }

    isEditing(itemId) {
        return this.editingItemId === itemId;
    }
}
