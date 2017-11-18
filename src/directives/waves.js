import { throttle } from '@/services/util'
const THREE = require('THREE')

window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame
window.cancelAnimationFrame =
    window.cancelAnimationFrame || window.mozCancelAnimationFrame

const SEPARATION = 100
const AMOUNTX = 50
const AMOUNTY = 50

let camera
let scene
let renderer
let particles
let count = 0
let mouseX = 0
let mouseY = -300
let windowHalfX = window.innerWidth / 2
// let windowHalfY = window.innerHeight / 2
let stop
let callbackResize

function init(el) {
    const container = document.createElement('div')
    el.appendChild(container)

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        1,
        10000
    )
    camera.position.z = 1000

    scene = new THREE.Scene()

    particles = []

    const material = new THREE.ParticleCanvasMaterial({
        color: 0xe1e1e1,
        program: function(context) {
            context.beginPath()
            context.arc(0, 0, 0.5, 0, Math.PI * 2, true)
            context.fill()
        }
    })

    let i = 0
    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            const particle = (particles[i++] = new THREE.Particle(material))
            particle.position.x = ix * SEPARATION - AMOUNTX * SEPARATION / 2
            particle.position.z = iy * SEPARATION - AMOUNTY * SEPARATION / 2
            scene.add(particle)
        }
    }

    renderer = new THREE.CanvasRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    document.addEventListener('mousemove', onDocumentMouseMove, false)
    document.addEventListener('touchstart', onDocumentTouchStart, false)
    document.addEventListener('touchmove', onDocumentTouchMove, false)
    callbackResize = throttle(onWindowResize, 500)
    window.addEventListener('resize', callbackResize, false)
}

function onWindowResize() {
    cancelAnimationFrame(stop)
    windowHalfX = window.innerWidth / 2
    // windowHalfY = window.innerHeight / 2

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
    animate()
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX
    // mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart(event) {
    if (event.touches.length === 1) {
        event.preventDefault()
        mouseX = event.touches[0].pageX - windowHalfX
        // mouseY = event.touches[0].pageY - windowHalfY;
    }
}

function onDocumentTouchMove(event) {
    if (event.touches.length === 1) {
        event.preventDefault()
        mouseX = event.touches[0].pageX - windowHalfX
        // mouseY = event.touches[0].pageY - windowHalfY;
    }
}

function animate() {
    stop = requestAnimationFrame(animate)
    render()
}

function render() {
    camera.position.x += (mouseX - camera.position.x) * 0.05
    camera.position.y += (-mouseY - camera.position.y) * 0.05
    camera.lookAt(scene.position)

    let i = 0
    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            const particle = particles[i++]
            particle.position.y =
                Math.sin((ix + count) * 0.3) * 50 +
                Math.sin((iy + count) * 0.5) * 50
            particle.scale.x = particle.scale.y =
                (Math.sin((ix + count) * 0.3) + 1) * 4 +
                (Math.sin((iy + count) * 0.5) + 1) * 4
        }
    }

    renderer.render(scene, camera)
    count += 0.1
}

export default {
    inserted: function(el, binding, vnode) {
        init(el)
        animate()
    },
    unbind: function(el) {
        document.removeEventListener('mousemove', onDocumentMouseMove, false)
        document.removeEventListener('touchstart', onDocumentTouchStart, false)
        document.removeEventListener('touchmove', onDocumentTouchMove, false)
        window.removeEventListener('resize', callbackResize, false)
    }
}
