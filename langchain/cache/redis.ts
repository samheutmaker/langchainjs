import { Redis } from 'io-redis';
import { Generation } from "../llms";
import { BaseCache, getCacheKey } from "./base";

/**
 * Will be generalized to support other array-like types
 * in the future. Not needed for now.
 * 
 * TODO: Generalize to support other array-like types.
 */

export class RedisCache extends BaseCache<Generation[]> {
  private redis: Redis;

  constructor(redis: Redis) {
    super();
    if (!redis) {
      throw new Error('Please pass in Redis object.');
    }
    this.redis = redis;
  }

  public lookup(prompt: string, llmKey: string): T | null {
    let idx = 0;
    let key = getCacheKey(prompt, llmKey, String(idx));
    const generations: Generation[] = [];
    
    while (this.redis.get(key)) {
      let result: string | null | Buffer = this.redis.get(key);
      if (!result) {
        break;
      } else if (result instanceof Buffer) {
        result = result.toString();
      }
      generations.push({ text: result });
      idx += 1;
      key = getCacheKey(prompt, llmKey, String(idx));
    }

    return generations.length > 0 ? generations : null;
  }

  public update(prompt: string, llmKey: string, value: Generation[]): void {
    for (let i = 0; i < value.length; i += 1) {
      const key = getCacheKey(prompt, llmKey, String(i));
      this.redis.set(key, value[i].text);
    }
  }
}