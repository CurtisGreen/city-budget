// type NodeMember = {
//   type: "node";
//   ref: number;
//   role: string;
//   lat: number;
//   lon: number;
// };

// type WayMember = {
//   type: "way";
//   ref: number;
//   role: string;
//   geometry: {
//     lat: number;
//     lon: number;
//   }[];
// };

// type Member = NodeMember | WayMember;

// type OverPassElement = {
//   type: string;
//   id: number;
//   bounds: {
//     minlat: number;
//     minlon: number;
//     maxlat: number;
//     maxlon: number;
//   };
//   members: Member[];
//   tags: Tags;
// };

// type Tags = {
//   admin_level: string;
//   boundary: string;
//   name: string;
//   type: string;
// };

// export type OverPassResponse = {
//   version: number;
//   generator: string;
//   osm3s: {
//     timestamp_osm_base: string;
//     timestamp_areas_base: string;
//     copyright: string;
//   };
//   elements: OverPassElement[];
// };

// GeoJSON types
export type GeoJSONMultiPolygon = {
  type: "MultiPolygon";
  coordinates: number[][][][];
};

export type GeoJSONPolygon = {
  type: "Polygon";
  coordinates: number[][][];
};

export type Point = {
  type: "Point";
};

export type GeoJSONFeature = {
  type: "Feature";
  properties: Record<string, string>;
  geometry: GeoJSONMultiPolygon | GeoJSONPolygon | Point;
};

export type SimplifiedGeoJSON = {
  type: string;
  features: GeoJSONFeature[];
};
