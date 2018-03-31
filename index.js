const shell = require("child_process");

// Load cli
let cli = require("./lib/cli")();
let config = new (require("./lib/config"))();

// Check if we need to create a config
if (cli.createConfig) {
    config.create();
    process.exit();
}

// Get the existing config
try {
    config = config.get();
}
catch (ex) {
    console.log("Could not load config.");
    process.exit();
}

// Start the engine

/// Check for input server command
if (config.input && config.input.directory && config.input.runcmd) {

    // Run the command
    console.log("Starting server...");
    let cmd = "cd " + config.input.directory + " && " + config.input.runcmd;
    shell.execSync(cmd);

}
