import { Generation } from "../llms";

/**
 * This cache key should be consistent across all versions of langchain.
 * It is currently NOT consistent across versions of langchain.
 * 
 * A huge benefit of having a remote cache (like redis) is that you can 
 * access the cache from different processes/machines. The allows you to
 * seperate concerns and scale horizontally.
 * 
 * TODO: Make this consistent across versions of langchain.
 */

export const getCacheKey = (prompt: string, llmKey: string, idx?: string): string =>
  `${prompt}_${llmKey}${idx ? `_${idx}` : ""}}`;

export abstract class BaseCache<T = Generation[]> {
  abstract lookup(prompt: string, llmKey: string): T | undefined;

  abstract update(prompt: string, llmKey: string, value: T): void;
}
