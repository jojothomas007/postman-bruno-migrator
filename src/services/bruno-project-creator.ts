// import { postmanToBruno } from '@usebruno/converters'; // You'll need both converters
// import { readFile, writeFile, readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import util from 'util';
// import { readdir } from 'fs';

export class BrunoProjectCreator {

    // Promisify exec for use with async/await
    execPromise = util.promisify(exec);

    // --- ESM-specific setup for __dirname equivalent ---
    __filename = fileURLToPath(import.meta.url);
    __dirname = path.dirname(fileURLToPath(import.meta.url));
    // --------------------------------------------------

    // --- Configuration ---
    INPUT_DIR = path.join(this.__dirname, './bruno-files');
    OUTPUT_DIR = path.join(this.__dirname, './bruno-projects');

    // async ensureDir(dir: string) {
    //     try {
    //         readdir(dir);
    //     } catch (e) {
    //         if (e.code === 'ENOENT') {
    //             await require('fs/promises').mkdir(dir, { recursive: true });
    //         } else {
    //             throw e;
    //         }
    //     }
    // }

    /**
     * Executes the 'bru export' command to transform the intermediate JSON 
     * into the final .bru folder structure.
     */
    async runBruExport(jsonFilePath: string) {
        const bruCommand = `bru export --input "${jsonFilePath}"`;
        console.log(`\n⏳ Running CLI command: ${bruCommand}`);
        try {
            const { stderr } = await this.execPromise(bruCommand, { cwd: this.OUTPUT_DIR });
            if (stderr) {
                console.warn(`[bru CLI Warning]: ${stderr}`);
            }
            // The output directory is created by the CLI inside the current working directory (OUTPUT_DIR)
            console.log(`\n✅ Generated .bru structure for: ${path.basename(jsonFilePath)}`);
        } catch (error) {
            console.error(`\n❌ Error running 'bru export' for ${path.basename(jsonFilePath)}:`, "error.message");
            throw error;
        }
    }

    async create() {

    }
}