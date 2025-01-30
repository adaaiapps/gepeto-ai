// index.js
const { exec } = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const kleur = require('kleur');

const argv = yargs(hideBin(process.argv)).argv;

const main = async () => {
    const name = argv.name;
    const git = argv.git;
    const icon = argv.icon;
    const api_key = argv.api_key;
    const llm_type = argv.llm_type;

    if (!name) {
        console.error(kleur.red("Project name is required. Use --name <project_name>"));
        process.exit(1);
    }

    const command = `python gepeto_ai.py --name ${name} --git ${git} --icon ${icon} --api_key ${api_key} --llm_type ${llm_type}`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(kleur.red(`Error executing command: ${error.message}`));
            return;
        }
        if (stderr) {
            console.error(kleur.yellow(`Stderr: ${stderr}`));
        }
        console.log(kleur.green(stdout));
    });
};

main();
