import './style.css'
import * as THREE from 'three'
import { GridPlane } from './components/gridPlane'
import { createLine } from './utils/helpers'
import { Polygon } from './components/polygon'

// Clicked Points

let points = []
let lines = []
let copiedPolygon = null
const polygonsList = []



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)

camera.position.x = 0
camera.position.y = 0
camera.position.z = 1
scene.add(camera)


const raycaster = new THREE.Raycaster();

const gridPlane = new GridPlane(scene, sizes, raycaster, camera)

gridPlane.onClick(e => {
    let p = e.point
    if (!copiedPolygon) {
        points.push(p)
        if (points.length > 1) {
            let p1 = points[points.length - 1]
            let p2 = points[points.length - 2]
            const line = createLine(p1, p2)
            scene.add(line)
            lines.push(line)
        }
    }else{
        console.log(copiedPolygon)
        copiedPolygon.position.set(e.point.x, e.point.y, e.point.z)
        copiedPolygon = null
    }
})

gridPlane.onHover(e => {
    if(copiedPolygon){
        copiedPolygon.position.set(e.point.x, e.point.y, e.point.z)
    }
})


const btn = document.getElementById('done')
const copyBtn = document.getElementById('copy')
const removeBtn = document.getElementById('remove')

btn.addEventListener('click', (e) => {
    e.stopPropagation()
    if (!copiedPolygon && points.length > 2) {
        const polygon = new Polygon(points, scene)
        polygonsList.push(polygon)

        lines.forEach(line => scene.remove(line))
        lines = []
        points = []
    }else{
        alert('Please select at least three points to create polygon')
    }
})

copyBtn.addEventListener('click', e => {
    e.stopPropagation()
    if (polygonsList.length > 0 && !copiedPolygon) {
        const polygonToBeCopied = polygonsList[polygonsList.length - 1]
        const polygon = new Polygon(polygonToBeCopied.points, scene)
        polygonsList.push(polygon)
        copiedPolygon = polygon.polygon
    }else if(polygonsList.length === 0){
        alert('Did not find any polygon to copy')
    }else if(copiedPolygon){
        alert('Please set the position of previously copied polygon')
    }
})

removeBtn.addEventListener('click', e => {
    e.stopPropagation()
    polygonsList.forEach(polygon => {
        polygon.polygon.clear()
        scene.remove(polygon.polygon)
    })
})



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()