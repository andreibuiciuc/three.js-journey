import Experience from "../Experience";

export default class World {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
    }
}