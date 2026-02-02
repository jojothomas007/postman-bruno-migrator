import * as fs from 'fs/promises';

export class FileManager{
    async createFolderIfNotExists(directoryPath: string): Promise<void> {
        try {
            // The recursive: true option is the key.
            // 1. It creates all parent directories if they don't exist.
            // 2. It will NOT throw an error if the directory already exists (Idempotence).
            await fs.mkdir(directoryPath, { recursive: true });
            console.log(`Successfully created or verified directory at: ${directoryPath}`);
        } catch (error) {
            console.error(`Error creating directory: ${directoryPath}`, error);
            throw error; 
        }
    }
}