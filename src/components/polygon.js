import { createPolygon } from "../utils/helpers";

export class Polygon {
    constructor(points, scene, object){
        this.points = points
        this.polygon = createPolygon(this.points)

        this.scene = scene
        this.add()
    }

    add() {
        this.scene.add(this.polygon)
    }
}