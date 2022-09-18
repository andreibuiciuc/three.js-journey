import EventEmitter from "./EventEmiiter";

export default class Sizes extends EventEmitter {
    constructor() {
        super();

        // Setup for a three experience inside the entire viewport.
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        // Event listeners
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);

            this.trigger('resize');
        });
    }
}