import { Generation } from "../llms";
import { BaseCache, getCacheKey } from "./base";

export class InMemoryCache<T = Generation[]> extends BaseCache<T> {
  #cache: Map<string, T>;

  constructor() {
    super();
    this.#cache = new Map();
  }

  lookup(prompt: string, llmKey: string): Promise<T | null>  {
    return Promise.resolve(this.#cache.get(getCacheKey(prompt, llmKey)) ?? null);
  }

  update(prompt: string, llmKey: string, value: T): void {
    this.#cache.set(getCacheKey(prompt, llmKey), value);
  }
}

