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
