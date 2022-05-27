import * as THREE from 'three'

export const createLine = (p1, p2) => {
    const material = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });

    const points = [p1, p2];

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    return line
}

export const createPolygon = (pointsList) => {
    const coordinatesList = pointsList;

    //container
    const container = new THREE.Group()

    // shape
    const geomShape = new THREE.ShapeBufferGeometry(new THREE.Shape(coordinatesList));
    const matShape = new THREE.MeshBasicMaterial({ color: "yellow" });
    const shape = new THREE.Mesh(geomShape, matShape);

    // points
    const geom = new THREE.BufferGeometry().setFromPoints(coordinatesList);
    const matPoints = new THREE.PointsMaterial({ size: 0.02, color: "red" });
    const points = new THREE.Points(geom, matPoints);

    //lines
    const lines = []
    for (let index = 0; index < pointsList.length; index++) {
        let p1 = pointsList[index]
        let p2 = pointsList[index+1] ? pointsList[index+1] : pointsList[0]
        
        lines.push(createLine(p1, p2))
    }

    container.add(shape, points, ...lines)

    return container
}