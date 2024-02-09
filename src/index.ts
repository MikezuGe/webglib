import { PerspectiveCamera } from "./Camera";
import { Renderer } from "./Renderer";
import { Scene } from "./Scene";
import { N2 } from "./definitions";
import { frame } from "./utils";

export const run = async (): Promise<void> => {
  const renderer = await Renderer.create();
  const cam = new PerspectiveCamera();
  const scene = Scene.fromJSON("scene2");

  const resize = (): void => {
    renderer.canvas.width = window.innerWidth;
    renderer.canvas.height = window.innerHeight;
    cam.aspectRatio = renderer.canvas.aspectRatio;
  };
  window.onresize = resize;
  resize();

  cam.transform.pz = 10;

  const d = document.createElement("div");
  d.style.position = "absolute";
  d.style.top = "0";
  d.style.left = "0";
  d.style.color = "white";
  document.body.appendChild(d);
  d.innerHTML = `
  <table>
    <tr>
      <td>Idle time:</td>
      <td id="idle_time"></td>
    </tr>
    <tr>
      <td>Work time:</td>
      <td id="work_time"></td>
    </tr>
    <tr>
      <td>Delta time:</td>
      <td id="avg_delta_time"></td>
    </tr>
    <tr>
      <td>Frame rate:</td>
      <td id="frame_rate"></td>
    </tr>
  </table>
  `;
  const idleTimeElement = document.getElementById("idle_time")!;
  const workTimeElement = document.getElementById("work_time")!;
  const avgDeltaTimeElement = document.getElementById("avg_delta_time")!;
  const frameRateElement = document.getElementById("frame_rate")!;

  const rFrame = (): void => {
    frame.start();
    requestAnimationFrame(rFrame);
    // for (const go of scene.gameObjects) {
    //   go.transform.rcs = performance.now() / 250;
    // }
    renderer.renderScene(scene, cam);
    frame.end();

    const { idleTime, workTime, avgDeltaTime, fps, deltaTime } = frame;

    idleTimeElement.textContent = `${idleTime.toFixed(N2)}ms (${(idleTime / deltaTime).toFixed(N2)}%)`;
    workTimeElement.textContent = `${workTime.toFixed(N2)}ms (${(workTime / deltaTime).toFixed(N2)}%)`;
    avgDeltaTimeElement.textContent = `${avgDeltaTime.toFixed(N2)}ms`;
    frameRateElement.textContent = `${fps.toFixed(N2)}fps`;
  };
  requestAnimationFrame(rFrame);
};

void run();
