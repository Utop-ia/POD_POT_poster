import { Framebuffer, RENDERER } from ".";

declare global {
  const SVG: "svg";

  function createCanvas(w: number, h: number, renderer: SVG): SVGImage;
  function createCanvas(w: number, h: number, renderer?: RENDERER): any;

  type SVGImage = {
    elt: SVGElement;
    attribute(name: string, value: any): void;
    query(selector: string): SVGImage[];
  };

  function loadSVG(path: string, callback?: (svg: SVGImage) => void): SVGImage;
  function querySVG(selector: string): SVGImage[];

  function image(
    img: SVGImage | Image | Element | Framebuffer | any,
    x: number,
    y: number,
    width?: number,
    height?: number
  ): void;
  function image(
    img: SVGImage | Image | Element | Framebuffer | any,
    dx: number,
    dy: number,
    dWidth: number,
    dHeight: number,
    sx: number,
    sy: number,
    sWidth?: number,
    sHeight?: number
  ): void;
}

export {};
