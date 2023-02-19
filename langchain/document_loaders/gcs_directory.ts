import { Storage } from '@google-cloud/storage';
import { Document } from '../docstore/document';
import { BaseDocumentLoader } from './base';
import { GCSFileLoader } from './gcs_file';

export class GCSDirectoryLoader extends BaseDocumentLoader {
  private readonly project_name: string;

  private readonly bucket: string;

  private readonly prefix: string;

  constructor(project_name: string, bucket: string, prefix = '') {
    super();
    this.project_name = project_name;
    this.bucket = bucket;
    this.prefix = prefix;
  }

  public async load(): Promise<Document[]> {
    const storage = new Storage({ projectId: this.project_name });
    const [blobs] = await storage.bucket(this.bucket).getFiles({ prefix: this.prefix });
    const docs: Document[] = [];
    for (const blob of blobs) {
      const loader = new GCSFileLoader(this.project_name, this.bucket, blob.name);
      docs.push(...(await loader.load()));
    }
    return docs;
  }
}
