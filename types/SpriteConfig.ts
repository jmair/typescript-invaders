import SheetSize from './SheetSize';
import type StartPosition from './Position';

export default interface SpriteConfig {
  startPosition: StartPosition;
  tag: string;
  sheetSize: SheetSize;
  frameCount: number;
  ticksPerFrame: number;
  loop?: boolean;
}
