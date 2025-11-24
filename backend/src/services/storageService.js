import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config/env.js';
import logger from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class StorageService {
  constructor() {
    this.type = config.storage.type;
    this.uploadDir = path.join(__dirname, '../../uploads');
    this.ensureUploadDir();
  }

  async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      logger.error({ error }, 'Failed to create upload directory');
    }
  }

  async saveFile(file, filename) {
    if (this.type === 'local') {
      return this.saveLocal(file, filename);
    }
    // TODO: Implementar S3
    throw new Error('S3 storage not implemented yet');
  }

  async saveLocal(file, filename) {
    const filepath = path.join(this.uploadDir, filename);
    await fs.writeFile(filepath, file.buffer);
    return `/uploads/${filename}`;
  }

  getFileUrl(filepath) {
    if (this.type === 'local') {
      return filepath;
    }
    // TODO: Retornar URL S3
    return filepath;
  }

  async deleteFile(filepath) {
    if (this.type === 'local') {
      const fullPath = path.join(__dirname, '../../', filepath);
      try {
        await fs.unlink(fullPath);
        return true;
      } catch (error) {
        logger.warn({ error, filepath }, 'Failed to delete file');
        return false;
      }
    }
    // TODO: Deletar do S3
    return false;
  }
}

export default new StorageService();


