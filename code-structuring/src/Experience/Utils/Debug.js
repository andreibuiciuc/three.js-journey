import * as dat from 'lil-gui';

export default class Debug {
    constructor() {
        this.isActive = window.location.hash === '#debug';

        if (this.isActive) {
            this.gui = new dat.GUI();
        }
    }
}