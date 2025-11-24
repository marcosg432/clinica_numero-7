import { env } from '../config/env';
import { logger } from '../config/logger';
import fs from 'fs/promises';
import path from 'path';
import multer from 'multer';

class StorageService {
  private storageType: string;
  private uploadDir: string;

  constructor() {
    this.storageType = env.STORAGE_TYPE;
    this.uploadDir = env.UPLOAD_DIR;
    this.initLocalStorage();
  }

  private async initLocalStorage() {
    if (this.storageType === 'local') {
      try {
        await fs.mkdir(this.uploadDir, { recursive: true });
        logger.info(`Diretório de upload criado: ${this.uploadDir}`);
      } catch (error) {
        logger.error('Erro ao criar diretório de upload:', error);
      }
    }
  }

  getMulterConfig() {
    const storage = multer.diskStorage({
      destination: async (req, file, cb) => {
        if (this.storageType === 'local') {
          await this.initLocalStorage();
          cb(null, this.uploadDir);
        } else {
          cb(null, '/tmp');
        }
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    });

    return multer({
      storage,
      limits: {
        fileSize: env.MAX_FILE_SIZE,
      },
      fileFilter: (req, file, cb) => {
        // Apenas imagens
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Apenas arquivos de imagem são permitidos'));
        }
      },
    });
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    if (this.storageType === 'local') {
      // Retornar URL relativa
      return `/uploads/${file.filename}`;
    }

    // TODO: Implementar upload para S3
    throw new Error('Upload para S3 não implementado ainda');
  }

  async deleteFile(filePath: string): Promise<boolean> {
    if (this.storageType === 'local') {
      try {
        const fullPath = path.join(process.cwd(), filePath);
        await fs.unlink(fullPath);
        return true;
      } catch (error) {
        logger.error('Erro ao deletar arquivo:', error);
        return false;
      }
    }

    // TODO: Implementar delete do S3
    return false;
  }

  getPublicUrl(filePath: string): string {
    if (this.storageType === 'local') {
      // Em produção, isso deve apontar para um CDN ou servidor de arquivos estáticos
      return filePath;
    }

    // TODO: Retornar URL do S3
    return filePath;
  }
}

export const storageService = new StorageService();
export default storageService;

