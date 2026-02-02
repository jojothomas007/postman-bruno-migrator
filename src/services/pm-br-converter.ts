import { postmanToBrunoEnvironment, postmanToBruno} from "@usebruno/converters";
import { readFile, writeFile } from "fs/promises"; 
import { FileManager } from "../utils/file-manager.js";
import * as fs from 'fs/promises';
import path from "path";
import { Config } from "../config.js";

export class PostmanBrunoConverter {
    async convertPostmanCollection(inputFile: string, outputFile: string): Promise<void> {
        try {
            const inputData = await readFile(inputFile, 'utf8');
            const brunoCollection = await postmanToBruno(JSON.parse(inputData));
            await writeFile(outputFile, JSON.stringify(brunoCollection, null, 2));
            console.log('Conversion successful!');
        } catch (error) {
            console.error('Error during conversion:', error);
        }
    }

    async convertPostmanEnvironment(inputFile: string, outputFile: string): Promise<void> {
        try {
            const inputData = await readFile(inputFile, 'utf8');
            const brunoEnvironment = await postmanToBrunoEnvironment(JSON.parse(inputData));
            await writeFile(outputFile, JSON.stringify(brunoEnvironment, null, 2));
            console.log('Environment conversion successful!');
        } catch (error) {
            console.error('Error during environment conversion:', error);
        }
    }
    async convertPostmanToBruno(): Promise<void> {
        const fileManager = new FileManager();
        const workspaces_filepath = path.join(Config.postman_files_folder, 'workspaces.json');
        const fileContent = await fs.readFile(workspaces_filepath, 'utf8')
        const workspaces = JSON.parse(fileContent);
        for (const workspace of workspaces) {
            const target_folder_path = path.join(Config.bruno_files_folder, workspace.name, "collections");
            fileManager.createFolderIfNotExists(target_folder_path)
            const src_folder_path = path.join(Config.postman_files_folder, workspace.name, "collections");
            // Read all items (files and folders) in the source directory
            const items = await fs.readdir(src_folder_path, { withFileTypes: true });
            for (const item of items) {
                if (item.isFile() && item.name.endsWith('.json')) {
                    const inputFile = path.join(src_folder_path, item.name);
                    const outputFile = path.join(target_folder_path, item.name);
                    this.convertPostmanCollection(inputFile, outputFile)
                }
            }
        }
    }
}

