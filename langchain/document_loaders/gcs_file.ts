import { Storage } from "@google-cloud/storage";
import { Document } from "../docstore/document";
import { BaseLoader } from "./base";
import { UnstructuredFileLoader } from "./unstructured_file";

export class GCSFileLoader extends BaseLoader {
  private readonly bucket: string;
  private readonly blob: string;
  private readonly project_name: string;

  constructor(project_name: string, bucket: string, blob: string) {
    super();
    this.bucket = bucket;
    this.blob = blob;
    this.project_name = project_name;
  }

  public async load(): Promise<Document[]> {
    let storage: Storage;
    try {
      storage = new Storage({
        projectId: this.project_name,
      });
    } catch (error) {
      throw new Error(
        "Could not import google-cloud-storage npm package. Please install it with `npm i @google-cloud/storage`."
      );
    }

    const bucket = storage.bucket(this.bucket);
    const file = bucket.file(this.blob);
    const tempFilePath = `/tmp/${this.blob}`;
    await file.download({ destination: tempFilePath });

    const loader = new UnstructuredFileLoader(tempFilePath);
    return loader.load();
  }
}
