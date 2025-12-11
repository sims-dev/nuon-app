import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';
import { IP_ADDRESS } from '../config/ipConfig';

@Injectable()
export class UploadService {
    private uploadDir = path.join(process.cwd(), 'uploads');

    constructor() {
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }

        // Configure Cloudinary (optional for development)
        if (process.env.CLOUDINARY_CLOUD_NAME) {
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
            });
        }
    }

    async uploadFile(file: any): Promise<any> {
        try {
            // For development, use local storage
            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = path.join(this.uploadDir, fileName);

            // Move file to uploads directory (support disk/memory/multipart stream variations)
            if (file.path && fs.existsSync(file.path)) {
                // Multer disk storage: file.path is provided and exists
                fs.renameSync(file.path, filePath);
            } else if (file.destination && file.filename) {
                // Multer may provide destination + filename
                const possiblePath = path.join(file.destination, file.filename);
                if (fs.existsSync(possiblePath)) {
                    fs.renameSync(possiblePath, filePath);
                } else {
                    throw new Error(`File was stored at ${possiblePath} but could not be found`);
                }
            } else if (file.buffer) {
                // Multer memory storage: write buffer
                fs.writeFileSync(filePath, file.buffer);
            } else if (file.stream && typeof file.stream.pipe === 'function') {
                // Busboy stream - pipe to disk
                await new Promise((resolve, reject) => {
                    const writeStream = fs.createWriteStream(filePath);
                    file.stream.pipe(writeStream);
                    writeStream.on('finish', () => resolve(undefined));
                    writeStream.on('error', (err) => reject(err));
                });
            } else {
                // Log file shape for debugging
                console.error('[UploadService] Unexpected file shape:', Object.keys(file || {}).reduce((acc, k) => (acc[k] = typeof file[k] === 'object' ? Object.keys(file[k]) : typeof file[k], acc), {}));
                throw new Error('Uploaded file is missing path, buffer, destination/filename, or stream');
            }

            const url = `http://${IP_ADDRESS}:5000/uploads/${fileName}`;

            return {
                success: true,
                url: url,
                publicId: fileName,
                message: 'File uploaded successfully'
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async uploadImage(file: any): Promise<any> {
        try {
            // Validate file size
            if (file.size === 0) {
                throw new Error('Uploaded image is empty (0 bytes)');
            }

            // For development, use local storage
            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = path.join(this.uploadDir, fileName);

            // Move file to uploads directory (support both disk and memory storage)
            if (file.path) {
                fs.renameSync(file.path, filePath);
            } else if (file.buffer) {
                fs.writeFileSync(filePath, file.buffer);
            } else {
                throw new Error('Uploaded image is missing path and buffer');
            }

            const url = `http://${IP_ADDRESS}:5000/uploads/${fileName}`;

            return {
                success: true,
                url: url,
                publicId: fileName,
                message: 'Image uploaded successfully'
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async uploadVideo(file: any): Promise<any> {
        try {
            // Validate file size
            if (file.size === 0) {
                throw new Error('Uploaded video is empty (0 bytes)');
            }

            // For development, use local storage
            const fileName = `${Date.now()}-${file.originalname}`;
            const filePath = path.join(this.uploadDir, fileName);

            // Move file to uploads directory (support both disk and memory storage)
            if (file.path) {
                fs.renameSync(file.path, filePath);
            } else if (file.buffer) {
                fs.writeFileSync(filePath, file.buffer);
            } else {
                throw new Error('Uploaded video is missing path and buffer');
            }

            const url = `http://${IP_ADDRESS}:5000/uploads/${fileName}`;

            return {
                success: true,
                url: url,
                publicId: fileName,
                message: 'Video uploaded successfully'
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async uploadMultipleFiles(files: any[]): Promise<any> {
        try {
            const uploadedFiles = await Promise.all(
                files.map(async (file) => {
                    const result = await cloudinary.uploader.upload(file.path, {
                        resource_type: 'auto',
                        folder: 'files'
                    });

                    // Remove file from local storage
                    fs.unlinkSync(file.path);

                    return {
                        originalName: file.originalname,
                        filename: file.filename,
                        size: file.size,
                        mimetype: file.mimetype,
                        url: result.secure_url,
                        publicId: result.public_id
                    };
                })
            );

            return {
                success: true,
                message: `${files.length} files uploaded successfully`,
                files: uploadedFiles
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }

    async deleteFile(filename: string): Promise<any> {
        try {
            // For Cloudinary, we need the public_id to delete
            // This is a simplified version - in real implementation,
            // you'd need to store the public_id when uploading
            return {
                success: true,
                message: 'File deletion not implemented for Cloudinary'
            };
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}