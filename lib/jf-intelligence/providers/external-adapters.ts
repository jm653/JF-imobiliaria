export interface GeocodingProvider {
  geocode(query: string): Promise<{ latitude: number; longitude: number } | null>;
}

export interface MapsProvider {
  distanceInKm(
    origin: { latitude: number; longitude: number },
    destination: { latitude: number; longitude: number }
  ): Promise<number | null>;
}

export interface VectorStoreProvider {
  upsertEmbedding(id: string, embedding: number[]): Promise<void>;
  search(embedding: number[], limit: number): Promise<Array<{ id: string; score: number }>>;
}
