import * as THREE from '../../../lib/three.module.js'
import  Shader from '../shader/test.child.shader.js'

export default class{
    constructor({group, size}){
        this.size = size

        this.param = {
            width: 100,
            height: 60
        }

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
                uRatio: {value: this.size.el.h / this.size.el.w}
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
        const {w, h} = this.size.el

        const x = (clientX / w) * 2 - 1
        const y = -(clientY / h) * 2 + 1
        
        this.mesh.material.uniforms['uMouse'].value = new THREE.Vector2(x, y)
    }
}