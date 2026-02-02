// config.ts
// Centralized configuration file for environment variables and constants
import dotenv from "dotenv";
dotenv.config();

export const Config = {
  // Base URL for Postman API
  postman_api_url: process.env.POSTMAN_API_URL || "https://api.getpostman.com",

  // API Key for Postman (keep this secret!)
  postman_api_key: process.env.POSTMAN_API_KEY || "",

  // You can add other global configs here
  log_level: process.env.LOG_LEVEL || "info",
  postman_files_folder: process.env.postman_files_folder || "postman-files",
  bruno_files_folder: process.env.bruno_files_folder || "bruno-files",
  bruno_projects_folder: process.env.bruno_projects_folder || "bruno-projects",
  get_workspace_list: process.env.get_workspace_list || "false",
  export_postman_workspaces: process.env.export_postman_workspaces || "false",
  convert_to_bruno_import_format: process.env.convert_to_bruno_import_format || "false",
  import_to_bruno: process.env.import_to_bruno || "false",
  skip_already_exported: process.env.skip_already_exported || "false",
};