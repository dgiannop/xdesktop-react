import { XView } from "./XView.js";

export class XWindow {
    static _nextId = 1;

    constructor(title = "Window", type = "generic", icon = "/images/Generic.png") {
        this.id = XWindow._nextId++;
        this.title = title;
        this.type = type;
        this.icon = icon;

        this.x = 80;
        this.y = 80;
        this.width = 480;
        this.height = 320;

        this.restoreX = this.x;
        this.restoreY = this.y;
        this.restoreWidth = this.width;
        this.restoreHeight = this.height;

        this.active = false;
        this.closed = false;
        this.minimized = false;
        this.maximized = false;

        this.zIndex = 1;

        this.view = new XView([], "");

        this.fileItem = null;
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
