🚀 Postman to Bruno Migration Automation
This project contains the scripts and documentation required to automatically convert exported Postman Collections and Environments into a Git-friendly Bruno project structure.

🌟 Goal
To achieve a fully automated, command-line workflow that transforms Postman's single-file JSON exports into Bruno's multi-file (.bru) directory structure, making the project ready for version control (Git).

📋 Prerequisites
Before running the migration script, ensure you have the following tools installed:

Node.js & npm: (Required to run the conversion script and install tools).

Postman Exports: JSON files for your collections (*.postman_collection.json) and environments (*.postman_environment.json).

🛠️ Project Setup
Clone/Download: CLone this repository and open project in vscode.

Install Dependencies: Install the core conversion package.
Bash  npm install

Install Bruno CLI: Install the global tool required for the final folder generation step. This resolves the "bru not recognized" error.
Bash npm install -g @usebruno/cli

Build source files:
npm run build

💻 Migration Process (The Automated Flow)
The migration is a three-step process executed entirely from the command line.

Step 1: Convert Postman JSON to Bruno Intermediate JSON
This step translates the data schema from Postman to Bruno's structure.

Action: Reads files in ./postman_files, converts them using @usebruno/converters, and saves the intermediate result to ./bruno_projects.

Bash

# Execute the conversion script
Output: A new directory for each workspace will be created in the output folder, containing single files like MyCollection.json and MyEnvironment.json.

Step 2: Generate the Git-Friendly Bruno Folder Structure
This crucial step uses the Bruno CLI to break down the single intermediate JSON file into the separate .bru files that are ideal for Git.

Tool: bru (The Bruno CLI)

Action: Reads the converted JSON, creates a dedicated folder for the collection, and writes individual .bru files for every request.

Bash

# Navigate to the output directory
cd bruno_projects

# Run the export command for each converted collection file
# Replace MyCollectionName.json with the actual file name
bru export --input MyCollectionName.json
Output: A new folder, e.g., ./bruno_projects/MyCollectionName/, containing the full .bru structure.

Step 3: Cleanup and Finalization
Remove Intermediate Files: You can optionally delete the intermediate JSON files, as the .bru structure is the final source of truth.

Bash

# (Optional) Delete the single JSON files after successful export
rm *.json
Open in Bruno: Launch the Bruno application and use the Open Collection feature to point to the new collection folder (./bruno_projects/MyCollectionName/).

Git Initialization: Commit the contents of the bruno_projects folder to your version control system.

⚠️ Important Notes
Script Translation: The @usebruno/converters tool does its best to translate Postman pre-request/test scripts, but manual review is highly recommended to ensure all pm.* functions are correctly converted to bru.* equivalents.

Environment Variables: After conversion, environment files are typically stored as plain JSON in the project. Review them to ensure sensitive data is not committed to Git if you are not using a .gitignore to exclude environment files.