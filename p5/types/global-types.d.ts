import { Font as P5Font, Graphics as P5Graphics, Image as P5Image } from ".";

declare global {
  type Font = P5Font;
  type Graphics = P5Graphics;
  type Image = P5Image;
}

export {};
