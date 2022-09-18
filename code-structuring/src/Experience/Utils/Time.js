import EventEmitter from "./EventEmiiter";

export default class Time extends EventEmitter {
    constructor() {
        super();

        // Setup
        this.startTime = Date.now();
        this.currentTime = this.startTime;
        this.elappsedTime = 0;
        this.delta = 16;

        window.requestAnimationFrame(() => {
            this.tick();
        });

        this.trigger('tick');

    }

    tick() {
        const currentTime = Date.now();
        this.delta = currentTime - this.currentTime;
        this.currentTime = currentTime;
        this.elappsedTime = this.currentTime - this.elappsedTime;

        window.requestAnimationFrame(() => {
            this.tick();
        })
    }
}