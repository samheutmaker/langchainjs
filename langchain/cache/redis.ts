import type { RedisClientType } from 'redis';
import { Generation } from "../llms";
import { BaseCache, getCacheKey } from "./base";

/**
 * 
 * TODO: Generalize to support other types.
 */

export class RedisCache extends BaseCache<Generation[]> {
  #redisClient: RedisClientType;

  constructor(redisClient: RedisClientType) {
    super();
    this.#redisClient = redisClient;
  }

  public async lookup(prompt: string, llmKey: string): Promise<Generation[] | null> {
    let idx = 0;
    let key = getCacheKey(prompt, llmKey, String(idx));
    let value = await this.#redisClient.get(key);
    const generations: Generation[] = [];
  
    while (value) {
      if (!value) {
        break;
      } 
      
      generations.push({ text: value });
      idx += 1;
      key = getCacheKey(prompt, llmKey, String(idx));
      value = await this.#redisClient.get(key);
    }

    return generations.length > 0 ? generations : null;
  }

  public update(prompt: string, llmKey: string, value: Generation[]): void {
    for (let i = 0; i < value.length; i += 1) {
      const key = getCacheKey(prompt, llmKey, String(i));
      this.#redisClient.set(key, value[i].text);
    }
  }
}
