import { MultipartFile } from '@fastify/multipart';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function uploadImage(file: MultipartFile): Promise<string> {
  const uploadDir = 'uploads/images';
  const allowedTypes = ['image/jpeg', 'image/png'];

  if (!file) {
    throw new Error('No file uploaded');
  }

  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type');
  }

  const fileName = `${uuidv4()}${extname(file.filename)}`;
  const filePath = join(uploadDir, fileName);

  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }

  try {
    const writeStream = createWriteStream(filePath);

    await new Promise((resolve, reject) => {
      file.file.pipe(writeStream);
      file.file.on('end', resolve);
      file.file.on('error', reject);
    });

    return fileName;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}
