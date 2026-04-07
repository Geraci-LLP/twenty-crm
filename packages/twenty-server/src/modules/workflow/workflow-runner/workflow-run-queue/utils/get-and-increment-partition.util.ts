import { CacheStorageService } from 'src/engine/core-modules/cache-storage/services/cache-storage.service';

export const getAndIncrementPartition = async (
  cacheStorageService: CacheStorageService,
  cacheKey: string,
  numberOfPartitions: number,
): Promise<number> => {
  const lastPartition =
    await cacheStorageService.get<number>(cacheKey);

  const partition =
    lastPartition !== undefined
      ? (lastPartition + 1) % numberOfPartitions
      : 0;

  await cacheStorageService.set(cacheKey, partition);

  return partition;
};
