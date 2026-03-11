import { useRef, useEffect } from "react";

/**
 * Shader source code for the animated background.
 * Implements a twisted, bayer-dithered spiral effect.
 */
const vertexShaderSource = `#version 300 es
layout(location = 0) in vec4 a_position;
void main() { gl_Position = a_position; }`;

const fragmentShaderSource = `#version 300 es
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
out vec4 fragColor;

const int bayer4x4[16] = int[16](0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);
    float l = length(uv);
    float angle = 6.0 * atan(uv.y, uv.x) + (u_time * 2.5);
    float twist = 1.1;
    float offset = pow(l, -twist) + angle / 6.283185;
    float mid = smoothstep(0.0, 1.0, pow(l, twist));
    float shape = mix(0.0, fract(offset), mid);

    float centerMask = smoothstep(0.2, 0.5, l);
    shape *= centerMask;

    float pxSize = 4.0;
    ivec2 bayerPos = ivec2(mod(gl_FragCoord.xy / pxSize, 4.0));
    float bayerValue = float(bayer4x4[bayerPos.y * 4 + bayerPos.x]) / 16.0;

    vec3 colorBack = vec3(1.0, 0.87, 0.0);
    vec3 colorFront = vec3(0.0, 0.0, 0.0);
    float res = step(bayerValue, shape);

    fragColor = vec4(mix(colorBack, colorFront, res), 1.0);
}`;

/**
 * Custom hook to encapsulate the WebGL2 background shader logic.
 * Handles initialization, animation loop, and cleanup to prevent memory leaks.
 */
export function useBackgroundShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize WebGL2 context.
    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    // Shader compilation helper.
    const createShader = (
      gl: WebGL2RenderingContext,
      type: number,
      source: string,
    ) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      // Validate compilation.
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const program = gl.createProgram()!;
    const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    if (!vs || !fs) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    // Validate linking.
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    // Setup full-screen quad.
    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    /**
     * Animation loop.
     */
    const render = (time: number) => {
      if (!canvas) return;
      // Responsive canvas sizing.
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);

      // Update uniforms.
      gl.uniform1f(gl.getUniformLocation(program, "u_time"), time * 0.001);
      gl.uniform2f(
        gl.getUniformLocation(program, "u_resolution"),
        canvas.width,
        canvas.height,
      );

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };
    let animId = requestAnimationFrame(render);

    // Comprehensive cleanup on unmount.
    return () => {
      cancelAnimationFrame(animId);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return canvasRef;
}
