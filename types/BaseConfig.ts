import Position from './Position';

export default interface BaseConfig {
  blockSize: number;
  topLeft: Position;
  color: string;
  width: number;
  height: number;
}
