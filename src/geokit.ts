import { LatLngLiteral } from './interfaces';
import { base32, calculateSlope, getBit, toDeg, toRad, validateCoordinates } from './helpers';

/**
 * A class for the Geokit.
 */
export class Geokit {
  /**
   * Generates 4 coordinates serving as a bounding box around two point.
   * @param a Starting coordinates.
   * @param b Ending coordinates.
   * @param width Unit of distance in Km.
   * @returns Bounding coordinates.
   */
  static boundingBox(a: LatLngLiteral, b: LatLngLiteral, width: number): Array<LatLngLiteral> {
    const slope: number = calculateSlope(a, b);
    width = ((Math.sqrt(2) * width) / 2);
    const top: LatLngLiteral = (a.lng > b.lng) ? a : b;
    const bottom: LatLngLiteral = (a.lng > b.lng) ? b : a;
    const point1: LatLngLiteral = (slope > 0) ? { lat: top.lat, lng: top.lng + width } : { lat: top.lat, lng: top.lng + width };
    const point2: LatLngLiteral = (slope > 0) ? { lat: top.lat + width, lng: top.lng } : { lat: top.lat - width, lng: top.lng };
    const point3: LatLngLiteral = (slope > 0) ? { lat: bottom.lat - width, lng: bottom.lng } : { lat: bottom.lat + width, lng: bottom.lng };
    const point4: LatLngLiteral = (slope > 0) ? { lat: bottom.lat, lng: bottom.lng - width } : { lat: bottom.lat, lng: bottom.lng - width };

    return [point1, point2, point3, point4];
  }

  /**
   * Generates an array of bounding box coordinates given an array of points.
   * @param coordinates Array of coordinates to box.
   * @param width Unit of distance in Km.
   * @returns Array of bounding coordinates.
   */
  static boundingBoxes(coordinates: Array<LatLngLiteral>, width: number): Array<Array<LatLngLiteral>> {
    const boxes: Array<Array<LatLngLiteral>> = [];
    for (let i = 0; i < coordinates.length; i++) {
      boxes.push(Geokit.boundingBox(coordinates[i], coordinates[i + 1], width))
    }
    return boxes;
  }

  /**
   * Get the distance between two coordinates.
   * @param start Starting coordinates.
   * @param end Ending coordinates.
   * @param unit Unit of distance returned, defaults to Km.
   * @returns The distance between two coordinates.
   */
  static distance(start: LatLngLiteral, end: LatLngLiteral, unit?: string): number {
    const startValid: Error = validateCoordinates(start);
    if (startValid instanceof Error) { throw new Error('Start coordinates: ' + startValid.message); }
    const endValid: Error = validateCoordinates(end);
    if (endValid instanceof Error) { throw new Error('End coordinates: ' + endValid.message); }

    const radius: number = (unit === 'miles') ? 3963 : 6371;
    const dLat: number = toRad(end.lat - start.lat);
    const dLon: number = toRad(end.lng - start.lng);
    const lat1: number = toRad(start.lat);
    const lat2: number = toRad(end.lat);
    const a: number = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (radius * c);
  }

  /**
   * Get the geohash of a point.
   * @param coordinates Coordinates to hash.
   * @param precision Precision of hash desired, defaults to 10.
   * @returns Geohash of point.
   */
  static hash(coordinates: LatLngLiteral, precision: number = 10): string {
    const valid: Error = validateCoordinates(coordinates);
    if (valid instanceof Error) { throw valid; }

    let hash: string = '';
    let latRng: number[] = [-90, 90];
    let lngRng: number[] = [-180, 180];
    while (hash.length < precision) {
      let temp: number = 0;
      for (let i: number = 0; i < 5; i++) {
        let even: boolean = (((hash.length * 5) + i) % 2) == 0;
        let coord: number = (even) ? coordinates.lng : coordinates.lat;
        const range: number[] = (even) ? lngRng : latRng;
        let middle: number = (range[0] + range[1]) / 2;
        temp = (temp << 1) + getBit(coord, range);
        (coord > middle) ? range[0] = middle : range[1] = middle;
      }
      hash += base32(temp);
    }
    return hash;
  }


}