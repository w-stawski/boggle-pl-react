"use client";

import { useRef, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { SettingsContextProvider } from "./contexts/SettingsContextProvider";
import { Coins } from "lucide-react";

// --- SHADER SOURCE ---
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

export default function Layout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    const createShader = (
      gl: WebGL2RenderingContext,
      type: number,
      source: string,
    ) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(
      program,
      createShader(gl, gl.VERTEX_SHADER, vertexShaderSource),
    );
    gl.attachShader(
      program,
      createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource),
    );
    gl.linkProgram(program);

    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    const pos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const render = (time: number) => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniform1f(gl.getUniformLocation(program, "u_time"), time * 0.001);
      gl.uniform2f(
        gl.getUniformLocation(program, "u_resolution"),
        canvas.width,
        canvas.height,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };
    const animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex min-h-screen flex-col font-mono selection:bg-black selection:text-white">
      {/* BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0 bg-[#FFDE00]">
        <canvas ref={canvasRef} className="h-full w-full opacity-25" />
        <div className="absolute inset-0 [background-image:linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b-3 border-black bg-white px-6 shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between">
          <Link
            to="/start"
            className="group transition-transform active:scale-95"
          >
            <div className="relative rotate-[-1deg] border-2 border-black bg-black px-4 py-1.5 shadow-[5px_5px_0_0_#FFDE00]">
              <p className="text-l font-black tracking-tighter uppercase italic">
                <span className="text-white">PL</span>
                <span className="text-[#FFDE00]">OGGLE</span>
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 border-2 border-black bg-white px-3 py-1 text-xs font-black shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
            <Coins size={14} />
            <span>CREDITS: 01</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 grow">
        <SettingsContextProvider>
          <Outlet />
        </SettingsContextProvider>
      </main>
    </div>
  );
}
