import { LatLngLiteral } from './interfaces';

/**
 * Get Base 32 symbol from decimal chunk (5 bit binary value).
 * @param value Decimal value of chunk (5 bit binary value).
 * @returns Base 32 value.
 */
export function base32(value: number): string {
  return '0123456789bcdefghjkmnpqrstuvwxyz'.charAt(value);
}

/**
  * Calculates slope given two coordinates.
  * @param a Starting coordinates.
  * @param b Ending coordinates.
  * @returns Slope between two coordinates.
  */
export function calculateSlope(a: LatLngLiteral, b: LatLngLiteral): number {
  return ((b.lng - a.lng) / (b.lat - a.lat));
}

/**
  * Determine if coordinate is greater than midle of range in a bit representation.
  * @param point Coordinates.
  * @param range Range of coordinates to check.
  * @returns Number representation if point is greater than the middle of the range.
  */
export function getBit(point: number, range: number[]): number {
  const middle: number = (range[0] + range[1]) / 2;
  return (middle > point) ? 0 : 1;
}

/**
 * Get degrees from radians.
 * @param radians Radians.
 * @returns Degrees.
 */
export function toDeg(radians: number): number {
  return (radians * 180 / Math.PI);
}
/**
 * Get radians from degrees.
 * @param degrees Degrees.
 * @returns Radians.
 */
export function toRad(degrees: number): number {
  return (degrees * Math.PI / 180);
}

/**
 * Validates user inputted coordinates.
 * @param coordinates User inputted coordinates.
 * @returns Error.
 */
export function validateCoordinates(coordinates: LatLngLiteral): Error {
  const error: string[] = [];
  if (coordinates.lat > 90) { error.push('Your latitude is greater than 90°'); }
  if (coordinates.lat < -90) { error.push('Your latitude is less than -90°'); }
  if (coordinates.lng > 180) { error.push('Your longitude is greater than 180°'); }
  if (coordinates.lng < -180) { error.push('Your longitude is less than -180°'); }
  if (error.length !== 0) { return new Error(error.join(' ')); }
}