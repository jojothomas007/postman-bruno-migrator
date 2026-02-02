import { Config } from "../config.js";
import { FileManager } from "../utils/file-manager.js";
import { PostmanService } from "./postman-service.js";
import fs from "fs";
import * as path from 'path';

interface ExportStatus {
    workspace: string;
    name: string;
    type: 'collection' | 'environment' | 'global_variables';
    status: 'success' | 'failed' | 'skipped';
    export_time: string;
}

export class PostmanExporter {
    private exportBaseFolder = path.join("output", Config.postman_files_folder.toLowerCase());
    private postmanService = new PostmanService();
    private exportStatus: ExportStatus[] = [];
    private skipAlreadyExported: boolean;

    constructor() {
        this.skipAlreadyExported = Config.skip_already_exported === "true";
    }

    /**
     * Fetch and save the list of all workspaces
     * Creates two files:
     * - workspaces.json: Full workspace data array
     * - workspace_list.json: Simple ID-to-name mapping
     */
    async fetch_workspaces(): Promise<void> {
        const fileManager = new FileManager();
        await fileManager.createFolderIfNotExists(this.exportBaseFolder);

        console.log("Exporting workspace list");
        const response = await this.postmanService.getWorkspaces();
        if (!response) {
            console.error("Failed to fetch workspaces");
            return;
        }

        const workspaces = response.data.workspaces || [];

        // Save full workspaces array
        const workspaces_path = path.join(this.exportBaseFolder, 'workspaces.json');
        fs.writeFileSync(workspaces_path, JSON.stringify(workspaces, null, 2));

        // Create ID-to-name mapping
        const wsListJson: Record<string, string> = {};
        for (const workspace of workspaces) {
            const wsId = workspace.id;
            const wsName = workspace.name;
            wsListJson[wsId] = wsName;
        }

        // Save workspace list mapping
        const workspace_list_path = path.join(this.exportBaseFolder, 'workspace_list.json');
        fs.writeFileSync(workspace_list_path, JSON.stringify(wsListJson, null, 2));

        console.log(`Exported workspace list successfully`);
    }

    /**
     * Export global variables from a workspace
     */
    async exportGlobalVariables(workspaceId: string, workspaceName: string): Promise<void> {
        const filename = path.join(this.exportBaseFolder, workspaceName, "global_variables.json");

        // Check if file exists and skip if flag is enabled
        if (this.skipAlreadyExported && fs.existsSync(filename)) {
            console.log(`Skipped global variables from workspace ${workspaceName} (already exists)`);
            this.exportStatus.push({
                workspace: workspaceName,
                name: "Globals",
                type: "global_variables",
                status: "skipped",
                export_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
            });
            return;
        }

        try {
            const response = await this.postmanService.getGlobalVariables(workspaceId);
            if (!response) {
                throw new Error("Failed to fetch global variables");
            }

            const globalVariablesDetails = response.data.workspace || {};
            // Extract only the globals part if it exists
            const globals = {
                name: "Globals",
                id: "sampleid",
                values: globalVariablesDetails.globals || []
            };

            const fileManager = new FileManager();
            await fileManager.createFolderIfNotExists(path.dirname(filename));
            fs.writeFileSync(filename, JSON.stringify(globals, null, 2));
            console.log(`Exported global variables from workspace ${workspaceName}`);
            this.exportStatus.push({
                workspace: workspaceName,
                name: "Globals",
                type: "global_variables",
                status: "success",
                export_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error exporting global variables from workspace ${workspaceName}: ${errorMessage}`);
            this.exportStatus.push({
                workspace: workspaceName,
                name: "Globals",
                type: "global_variables",
                status: "failed",
                export_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
            });
        }
    }

    /**
     * Export collections from a workspace
     */
    async exportCollections(collections: any[], workspaceName: string): Promise<void> {
        for (const collection of collections) {
            const colName = collection.name || "Unknown";
            const filename = path.join(this.exportBaseFolder, workspaceName, "collections", `${colName}.json`);

            // Check if file exists and skip if flag is enabled
            if (this.skipAlreadyExported && fs.existsSync(filename)) {
                console.log(`Skipped collection ${colName} from workspace ${workspaceName} (already exists)`);
                this.exportStatus.push({
                    workspace: workspaceName,
                    name: colName,
                    type: "collection",
                    status: "skipped",
                    export_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
                });
                continue;
            }

            try {
                const colId = collection.uid || collection.id;
                console.log(`Importing collection name: ${colName}`);
                const response = await this.postmanService.getCollection(colId);
                if (!response) {
                    throw new Error("Failed to fetch collection");
                }
                const colDetail = response.data.collection;

                const fileManager = new FileManager();
                await fileManager.createFolderIfNotExists(path.dirname(filename));
                fs.writeFileSync(filename, JSON.stringify(colDetail, null, 2));
                console.log(`Exported ${colName} from workspace ${workspaceName}`);
                this.exportStatus.push({
                    workspace: workspaceName,
                    name: colName,
                    type: "collection",
                    status: "success",
                    export_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(`Error exporting collection ${colName} from workspace ${workspaceName}: ${errorMessage}`);
                this.exportStatus.push({
                    workspace: workspaceName,
                    name: colName,
                    type: "collection",
                    status: "failed",
                    export_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
                });
            }
        }
    }

    /**
     * Export environments from a workspace
     */
    async exportEnvironments(environments: any[], workspaceName: string): Promise<void> {
        for (const environment of environments) {
            const envName = environment.name || "Unknown";
            const filename = path.join(this.exportBaseFolder, workspaceName, "environments", `${envName}.json`);

            // Check if file exists and skip if flag is enabled
            if (this.skipAlreadyExported && fs.existsSync(filename)) {
                console.log(`Skipped environment ${envName} from workspace ${workspaceName} (already exists)`);
                this.exportStatus.push({
                    workspace: workspaceName,
                    name: envName,
                    type: "environment",
                    status: "skipped",
                    export_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
                });
                continue;
            }

            try {
                const envId = environment.uid || environment.id;
                console.log(`Importing environment name: ${envName}`);
                const response = await this.postmanService.getEnvironment(envId);
                if (!response) {
                    throw new Error("Failed to fetch environment");
                }
                const envDetail = response.data.environment;

                const fileManager = new FileManager();
                await fileManager.createFolderIfNotExists(path.dirname(filename));
                fs.writeFileSync(filename, JSON.stringify(envDetail, null, 2));
                console.log(`Exported ${envName} from workspace ${workspaceName}`);
                this.exportStatus.push({
                    workspace: workspaceName,
                    name: envName,
                    type: "environment",
                    status: "success",
                    export_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.error(`Error exporting environment ${envName} from workspace ${workspaceName}: ${errorMessage}`);
                this.exportStatus.push({
                    workspace: workspaceName,
                    name: envName,
                    type: "environment",
                    status: "failed",
                    export_time: new Date().toISOString().replace('T', ' ').substring(0, 19)
                });
            }
        }
    }

    /**
     * Export all data from a single workspace
     */
    async exportWorkspaceData(workspaceId: string, workspaceName: string): Promise<void> {
        const response = await this.postmanService.getWorkspace(workspaceId);
        if (!response) {
            console.error(`Failed to fetch workspace ${workspaceName}`);
            return;
        }

        const ws = response.data.workspace || {};
        const collections = ws.collections || [];
        const environments = ws.environments || [];

        // Export global variables
        await this.exportGlobalVariables(ws.id, workspaceName);

        // Export collections
        await this.exportCollections(collections, workspaceName);

        // Export environments
        await this.exportEnvironments(environments, workspaceName);
    }

    /**
     * Main export method - exports all workspaces
     */
    async export(): Promise<void> {
        const fileManager = new FileManager();
        await fileManager.createFolderIfNotExists(this.exportBaseFolder);
        const workspaces_filepath = path.join(this.exportBaseFolder, 'workspace_list.json');

        if (!fs.existsSync(workspaces_filepath)) {
            console.error("Workspaces file not found. Please run fetch_workspaces first.");
            return;
        }

        const fileContent = fs.readFileSync(workspaces_filepath, 'utf8');
        const workspaceList: Record<string, string> = JSON.parse(fileContent);

        // Iterate over workspace ID-to-name mapping
        for (const [wsId, wsName] of Object.entries(workspaceList)) {
            console.log(`\n========== Processing workspace: ${wsName} ==========`);
            await this.exportWorkspaceData(wsId, wsName);
        }

        // Save status to CSV after all exports
        await this.saveStatusToCsv();
    }

    /**
     * Save export status to a CSV file (appends if file exists)
     */
    async saveStatusToCsv(filename: string = "output/export_status.csv"): Promise<void> {
        if (this.exportStatus.length === 0) {
            console.log("No export status to save");
            return;
        }

        const fileManager = new FileManager();
        await fileManager.createFolderIfNotExists(path.dirname(filename));

        // Check if file exists to determine if we need to write header
        const fileExists = fs.existsSync(filename);

        // Prepare CSV content
        const header = "export_time,workspace,name,type,status\n";
        const rows = this.exportStatus.map(item =>
            `${item.export_time},${item.workspace},${item.name},${item.type},${item.status}`
        ).join("\n");

        // Append or create file
        if (fileExists) {
            fs.appendFileSync(filename, rows + "\n");
            console.log(`Export status appended to ${filename}`);
        } else {
            fs.writeFileSync(filename, header + rows + "\n");
            console.log(`Export status saved to ${filename}`);
        }

        // Print summary
        const total = this.exportStatus.length;
        const success = this.exportStatus.filter(item => item.status === "success").length;
        const failed = this.exportStatus.filter(item => item.status === "failed").length;
        const skipped = this.exportStatus.filter(item => item.status === "skipped").length;
        console.log(`\nExport Summary: ${success} successful, ${failed} failed, ${skipped} skipped out of ${total} total items`);
    }
}
