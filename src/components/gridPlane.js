import * as THREE from 'three'

export class GridPlane {
    constructor(scene, sizes, raycaster, camera) {
        this.scene = scene
        this.sizes = sizes
        this.raycaster = raycaster
        this.camera = camera

        this.ang_rad = 45.0 * Math.PI / 180;
        this.fov_y = 2 * Math.tan(this.ang_rad / 2) * 2;

        this.plane = this.createPlane()
        this.scene.add(this.plane)
        this.scene.add(this.createGrid())

        this.intersects = null
        this.mouseClick = new THREE.Vector2()
        this.mouseMove = new THREE.Vector2()

        // return 
    }

    createPlane() {
        const geometry = new THREE.PlaneBufferGeometry(this.fov_y * this.sizes.width / this.sizes.height, this.fov_y)
        geometry.name = "Base Plane"
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
        const plane = new THREE.Mesh(
            geometry,
            material
        )
        return plane
    }

    createGrid() {
        const size = this.fov_y * this.sizes.width / this.sizes.height;
        const divisions = Math.round(this.fov_y * this.sizes.width / this.sizes.height) * 10;

        const gridHelper = new THREE.GridHelper(size, divisions);

        gridHelper.position.set(0, 0, 0.1)
        gridHelper.rotation.set(-Math.PI / 2, 0, 0)

        return gridHelper
    }

    onClick (fn) {

        window.addEventListener("click", (Event) => {
            this.mouseClick.x = (Event.clientX / this.sizes.width) * 2 - 1;
            this.mouseClick.y = -(Event.clientY / this.sizes.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouseClick, this.camera);
            this.intersects = this.raycaster.intersectObjects([this.plane]);

            if (this.intersects && this.intersects.length > 0) {
                fn(this.intersects[0])
            }
        });
    }

    onHover (fn) {
        window.addEventListener("mousemove", (Event) => {
            this.mouseMove.x = (Event.clientX / this.sizes.width) * 2 - 1;
            this.mouseMove.y = -(Event.clientY / this.sizes.height) * 2 + 1;

            this.raycaster.setFromCamera(this.mouseMove, this.camera);
            this.intersects = this.raycaster.intersectObjects([this.plane]);

            if (this.intersects && this.intersects.length > 0) {
                fn(this.intersects[0])
            }
        });
    }

}