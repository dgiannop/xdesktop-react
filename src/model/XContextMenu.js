export class XContextMenu {
    constructor() {
        this.visible = false;
        this.x = 0;
        this.y = 0;
        this.items = [];
        this.target = null;
    }

    open(x, y, items = [], target = null) {
        this.visible = true;
        this.x = x;
        this.y = y;
        this.items = items;
        this.target = target;
    }

    close() {
        this.visible = false;
        this.items = [];
        this.target = null;
    }
}
