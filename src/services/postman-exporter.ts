import { Config } from "../config.js";
import { FileManager } from "../utils/file-manager.js";
import { PostmanService } from "./postman-service.js";
import fs from "fs";
import * as path from 'path';

export class PostmanExporter {
    export_base_folder = path.join("output", Config.postman_files_folder.toLowerCase())
    postmanService = new PostmanService();
    async fetch_workspaces(): Promise<void> {
        // Get all workspaces
        const fileManager = new FileManager();
        await fileManager.createFolderIfNotExists(this.export_base_folder);
        const response = await this.postmanService.getWorkspaces();
        if (!response) {
            console.error("Failed to fetch workspaces");
            return;
        }
        const workspaces = response.data.workspaces || [];
        const file_path = path.join(this.export_base_folder, 'workspaces.json');

        // Write collection details to file
        fs.writeFileSync(file_path, JSON.stringify(workspaces, null, 2));
        console.log(`Exported list of awailable workspaces successfully`);
    }
    async export(): Promise<void> {
        const fileManager = new FileManager();
        await fileManager.createFolderIfNotExists(this.export_base_folder);
        const workspaces_filepath = path.join(this.export_base_folder, 'workspaces.json');
        const fileContent = fs.readFileSync(workspaces_filepath, 'utf8')
        const workspaces = JSON.parse(fileContent);
        for (const workspace of workspaces) {
            const wsId = workspace.id;

            // Get workspace details
            const wsResponse = await this.postmanService.getWorkspace(wsId);
            if (!wsResponse) continue;

            const ws = wsResponse.data.workspace || {};
            const collections_folder_path = path.join(this.export_base_folder, ws.name, "collections");
            fileManager.createFolderIfNotExists(collections_folder_path)
            const environments_folder_path = path.join(this.export_base_folder, ws.name, "environments");
            fileManager.createFolderIfNotExists(environments_folder_path)
            const collections = ws.collections || [];

            for (const collection of collections) {
                this.export_collection(ws.name, collection.id)
            }
        }
    }
    async export_collection(workspace_name: string, collection_id: string): Promise<void> {
        // Get collection details
        const colResponse = await this.postmanService.getCollection(collection_id);
        if (!colResponse) {
            console.error("Failed to fetch collection");
            return;
        }
        const colDetail = colResponse.data.collection;
        const file_path = path.join(this.export_base_folder, workspace_name, "collections", `${colDetail.info.name}.json`);

        // Write collection details to file
        fs.writeFileSync(file_path, JSON.stringify(colDetail, null, 2));
        console.log(`Exported ${colDetail.info.name} from workspace ${workspace_name}`);
    }
    async export_environment(workspace_name: string, environment_id: string): Promise<void> {
        // Get environment details
        const response = await this.postmanService.getCollection(environment_id);
        if (!response) {
            console.error("Failed to fetch collection");
            return;
        }
        const envDetail = response.data.environment;
        const file_path = path.join(this.export_base_folder, workspace_name, "environments", `${envDetail.name}.json`);

        // Write collection details to file
        fs.writeFileSync(file_path, JSON.stringify(envDetail, null, 2));
        console.log(`Exported ${envDetail.name} from workspace ${workspace_name}`);
    }
}
