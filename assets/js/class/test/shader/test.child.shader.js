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

        varying vec2 vUv;

        float circle(in vec2 _st, in float _radius, in float _blur){
            // vec2 dist = _st-vec2(0.5);
            vec2 dist = _st;
            return 1.-smoothstep(_radius-(_radius*_blur),
                                 _radius+(_radius*_blur),
                                 dot(dist,dist)*4.0);
        }

        ${ShaderMethod.executeNormalizing()}

        void main(){
            // example
            // vec2 st = (gl_FragCoord.xy / uRes.xy) - vec2(0.5);
            // st.y *= uRatio;

            // vec2 mouse = uMouse * -0.5;
            // vec2 pos = st + mouse;
            // vec3 c = vec3(circle(pos, 0.01, 0.25));



            // test 1
            vec2 st = gl_FragCoord.xy - (uRes.xy * 0.5);
            vec2 mouse = uMouse * 0.5;
            float mx = mouse.x * uRes.x;
            float my = mouse.y * uRes.y;

            float dist = (100.0 - clamp(distance(st, vec2(mx, my)), 0.0, 100.0)) / 100.0;
            vec3 c = vec3(dist);


            gl_FragColor = vec4(c, 1.0);
        }
    `
}