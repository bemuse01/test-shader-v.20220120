import ShaderMethod from '../../../method/method.shader.js'

export default {
    vertex: `
        varying vec2 vUv;

        void main(){
            vUv = uv;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragment: `
        uniform vec2 uMouse;
        uniform vec2 uRes;
        uniform float uRatio;
        uniform float uTime;

        varying vec2 vUv;

        float circle(in vec2 _st, in float _radius, in float _blur){
            // vec2 dist = _st-vec2(0.5);
            vec2 dist = _st;
            return 1.-smoothstep(_radius-(_radius*_blur),
                                 _radius+(_radius*_blur),
                                 dot(dist,dist)*4.0);
        }

        ${ShaderMethod.executeNormalizing()}
        ${ShaderMethod.snoise3D()}

        const float blur = 99.0;
        const float radius = 100.0;
        const float toPer = radius - blur;

        void main(){
            // example
            // vec2 st = (gl_FragCoord.xy / uRes.xy) - vec2(0.5);
            // st.y *= uRatio;

            // vec2 mouse = uMouse * -0.5;
            // vec2 pos = st + mouse;
            // vec3 c = vec3(circle(pos, 0.01, 0.25));



            // test 1
            vec2 st = gl_FragCoord.xy - (uRes.xy * 0.5);
            vec2 mouse = uMouse * uRes * 0.5;

            float n = executeNormalizing(snoise3D(vec3(st * 0.01, uTime * 0.001)), 0.0, 1.0, -1.0, 1.0);
            float r = 70.0 + 30.0 * n;
            float b = r - 1.0;
            float t = r - b;

            float d = (r - clamp(distance(st, mouse), b, r)) / t;
            vec3 c = vec3(d);

            

            gl_FragColor = vec4(c, 1.0);
        }
    `
}