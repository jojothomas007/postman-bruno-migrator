import { postmanToBrunoEnvironment, postmanToBruno } from "@usebruno/converters";
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
        const workspaces_filepath = path.join('output', Config.postman_files_folder, 'workspace_list.json');
        const fileContent = await fs.readFile(workspaces_filepath, 'utf8')
        const workspaceList: Record<string, string> = JSON.parse(fileContent);

        // Iterate over workspace ID-to-name mapping
        for (const [_wsId, wsName] of Object.entries(workspaceList)) {
            // Convert Collections
            const collections_target_path = path.join('output', Config.bruno_files_folder, wsName, "collections");
            await fileManager.createFolderIfNotExists(collections_target_path)
            const collections_src_path = path.join('output', Config.postman_files_folder, wsName, "collections");

            // Check if collections source directory exists before trying to read it
            try {
                await fs.access(collections_src_path);
                // Read all items (files and folders) in the collections directory
                const collectionItems = await fs.readdir(collections_src_path, { withFileTypes: true });
                for (const item of collectionItems) {
                    if (item.isFile() && item.name.endsWith('.json')) {
                        const inputFile = path.join(collections_src_path, item.name);
                        const outputFile = path.join(collections_target_path, item.name);
                        await this.convertPostmanCollection(inputFile, outputFile)
                    }
                }
            } catch (error) {
                console.warn(`Collections directory not found, skipping: ${collections_src_path}`);
            }

            // Convert Environments
            const environments_target_path = path.join('output', Config.bruno_files_folder, wsName, "environments");
            await fileManager.createFolderIfNotExists(environments_target_path)
            const environments_src_path = path.join('output', Config.postman_files_folder, wsName, "environments");

            // Check if environments source directory exists before trying to read it
            try {
                await fs.access(environments_src_path);
                // Read all items (files and folders) in the environments directory
                const environmentItems = await fs.readdir(environments_src_path, { withFileTypes: true });
                for (const item of environmentItems) {
                    if (item.isFile() && item.name.endsWith('.json')) {
                        const inputFile = path.join(environments_src_path, item.name);
                        const outputFile = path.join(environments_target_path, item.name);
                        await this.convertPostmanEnvironment(inputFile, outputFile)
                    }
                }
            } catch (error) {
                console.warn(`Environments directory not found, skipping: ${environments_src_path}`);
            }
        }
    }
}

