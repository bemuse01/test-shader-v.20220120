import * as THREE from '../../../lib/three.module.js'
import  Shader from '../shader/test.child.shader.js'

export default class{
    constructor({group, size}){
        this.size = size

        this.param = {
            width: 100,
            height: 60
        }

        this.ix = 0
        this.iy = 0
        this.vx = 0
        this.vy = 0
        this.friction = 0.15

        this.init(group)
    }


    // init
    init(group){
        this.create(group)

        window.addEventListener('mousemove', e => this.onMousemove(e))
    }


    // create
    create(group){
        const geometry = new THREE.PlaneGeometry(this.param.width, this.param.height, 1, 1)
        const material = new THREE.ShaderMaterial({
            vertexShader: Shader.vertex,
            fragmentShader: Shader.fragment,
            transparent: true,
            uniforms: {
                uMouse: {value: new THREE.Vector2(0, 0)},
                uRes: {value: new THREE.Vector2(this.size.el.w, this.size.el.h)},
                uRatio: {value: this.size.el.h / this.size.el.w},
                uTime: {value: null}
            }
        })
        this.mesh = new THREE.Mesh(geometry, material)

        group.add(this.mesh)
    }


    // resize
    resize(size){
        this.size = size

        this.mesh.material.uniforms['uRes'].value = new THREE.Vector2(this.size.el.w, this.size.el.h)
        this.mesh.material.uniforms['uRatio'].value = this.size.el.h / this.size.el.w
    }


    // on mouse move
    onMousemove(e){
        const {clientX, clientY} = e

        this.ix = clientX
        this.iy = clientY
    }


    // animate
    animate(){
        const {w, h} = this.size.el
        const time = window.performance.now()

        this.vx += (this.ix - this.vx) * this.friction
        this.vy += (this.iy - this.vy) * this.friction

        const x = (this.vx / w) * 2 - 1
        const y = -(this.vy / h) * 2 + 1

        this.mesh.material.uniforms['uMouse'].value = new THREE.Vector2(x, y)
        this.mesh.material.uniforms['uTime'].value = time
    }
}