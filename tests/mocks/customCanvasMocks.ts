import { CustomCanvas } from "src/CustomCanvas";

export const defaultCustomCanvas = new CustomCanvas();

export const customCanvasWithCustomProperties = new CustomCanvas();
customCanvasWithCustomProperties.backgroundColor = "#FFFFFF";
customCanvasWithCustomProperties.height = 100;
customCanvasWithCustomProperties.left = 10;
customCanvasWithCustomProperties.top = 10;
customCanvasWithCustomProperties.width = 100;
