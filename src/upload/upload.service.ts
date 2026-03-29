import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
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
}
