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
        uniform float uBoundary;
        uniform float uRadius;
        uniform float uBlur;
        uniform sampler2D uTexture[2];
        
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

            float radius = uRadius * max(uRes.x, uRes.y);
            float boundary = radius * uBoundary;

            float n = snoise3D(vec3(vUv * 10.0, uTime * 0.001));
            float e = executeNormalizing(n, 0.0, 1.0, -1.0, 1.0);
            float r = (radius - boundary)  + boundary * e;
            float b = r - uBlur;
            float t = r - b;

            float d = (r - clamp(distance(st, mouse), b, r)) / t;
            // vec3 c = vec3(d);

            vec4 tex1 = texture(uTexture[0], vUv);
            vec4 tex2 = texture(uTexture[1], vUv);

            vec4 finalTex = mix(tex1, tex2, d);


            
            // test 2 (ref example)
            // vec2 st = gl_FragCoord.xy - (uRes.xy * 0.5);
            // vec2 mouse = uMouse * uRes * 0.5;

            // float offx = vUv.x + sin(vUv.y + uTime * .1);
            // float offy = vUv.y - uTime * 0.1 - cos(uTime * .001) * .01;

            // float r = uRadius;
            // float b = r - uBlur;
            // float t = r - b;

            // float n = snoise3D(vec3(offx, offy, uTime * .1) * 8.) - 1.;
            // float d = (r - clamp(distance(st, mouse), b, r)) / t * 1.25;

            // float finalMask = smoothstep(0.4, 0.5, n + pow(d, 2.));

            // vec3 c = vec3(finalMask);


            gl_FragColor = finalTex;
        }
    `
}