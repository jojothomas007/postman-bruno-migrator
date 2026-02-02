import { Config } from "./config.js";
import { BrunoProjectCreator } from "./services/bruno-project-creator.js";
import { PostmanBrunoConverter } from "./services/pm-br-converter.js";
import { PostmanExporter } from "./services/postman-exporter.js";


async function mainMethod(): Promise<void> {
    const postmanExporter = new PostmanExporter();
    const postmanBrunoConverter = new PostmanBrunoConverter();
    const brunoProjectCreator = new BrunoProjectCreator();
    if (Config.get_workspace_list.toLowerCase() == "true") {
        postmanExporter.fetch_workspaces();
    }
    if (Config.export_postman_workspaces.toLowerCase() == "true") {
        postmanExporter.export();
    }
    if (Config.convert_to_bruno_import_format.toLowerCase() == "true") {
        postmanBrunoConverter.convertPostmanToBruno()
    }
    if (Config.import_to_bruno.toLowerCase() == "true") {
        brunoProjectCreator.create()
    }
}

// Run main
mainMethod().catch((err) => {
    console.error("Unexpected error:", err);
});