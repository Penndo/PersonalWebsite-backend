import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import { join, extname } from 'path';

@Injectable()
export class UploadService {
  private readonly uploadDir = join(process.cwd(), '..', 'public', 'uploads');

  constructor() {
    // Create upload directory if it doesn't exist
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileName = `${Date.now()}_${Math.round(Math.random() * 10000)}${extname(file.originalname)}`;
      const filePath = join(this.uploadDir, fileName);

      // Create write stream and save file
      const writeStream = createWriteStream(filePath);
      await new Promise<void>((resolve, reject) => {
        writeStream.write(file.buffer, (error) => {
          if (error) {
            reject(error);
          } else {
            writeStream.end();
            resolve();
          }
        });
      });

      // Return relative URL
      return `/uploads/${fileName}`;
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  /** 仅允许删除 public/uploads 下文件，防止路径穿越 */
  deleteByPublicUrl(raw: string): void {
    let pathPart = (raw || '').trim();
    try {
      if (pathPart.startsWith('http://') || pathPart.startsWith('https://')) {
        pathPart = new URL(pathPart).pathname;
      }
    } catch {
      throw new BadRequestException('Invalid url');
    }
    if (!pathPart.startsWith('/uploads/')) {
      throw new BadRequestException('Only /uploads/* files can be removed');
    }
    const base = pathPart.slice('/uploads/'.length);
    if (!base || base.includes('..') || base.includes('/') || base.includes('\\')) {
      throw new BadRequestException('Invalid file name');
    }
    const filePath = join(this.uploadDir, base);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
  }
}
