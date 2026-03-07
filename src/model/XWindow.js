export class XWindow {
    static _nextId = 1;

    constructor(title = "Window", kind = "generic", icon = "/images/Generic.png") {
        this.id = XWindow._nextId++;
        this.title = title;
        this.kind = kind;
        this.icon = icon;

        this.x = 80;
        this.y = 80;
        this.width = 480;
        this.height = 320;

        this.active = false;
        this.closed = false;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    resizeTo(width, height) {
        this.width = width;
        this.height = height;
    }

    close() {
        this.closed = true;
    }
}