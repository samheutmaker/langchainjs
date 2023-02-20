import { Generation } from "../llms";
import { BaseCache, getCacheKey } from "./base";

export class InMemoryCache<T = Generation[]> extends BaseCache<T> {
  private cache: Record<string, T>;

  constructor() {
    super();
    this.cache = {};
  }

  lookup(prompt: string, llmKey: string) {
    return this.cache[getCacheKey(prompt, llmKey)];
  }

  update(prompt: string, llmKey: string, value: T) {
    this.cache[getCacheKey(prompt, llmKey)] = value;
  }
}

