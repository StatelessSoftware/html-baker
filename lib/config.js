const env = process.env.NODE_ENV || 'default';
const suppress = process.env.SUPPRESS_NO_CONFIG_WARNING = 'y';

const shell = require("child_process");
const config = require("config");
const path = require("path");
const fs = require("fs");

module.exports = function() {

    /**
     * Create a new config
     */
    this.create = function() {

        let file = path.normalize("config/" + env + ".json");
        let dir = path.dirname(file);

        // Check for config dir
        if (!fs.existsSync("config")) {
            shell.execSync("mkdir " + dir);
        }

        // Pull default config
        let defaultConfig = require("../config.json");

        // Check for environment config file
        if (!fs.existsSync(file)) {

            try {
                // Create file
                fs.writeFileSync(file,
                    JSON.stringify(
                        defaultConfig,
                        null,
                        '\t'
                    )
                );

                console.log("Config file created successfully.");
            }
            catch (ex) {
                throw "Could not create configuration file.";
            }

        }
        else {
            // Append the config to existing
            let existingConfig = fs.readFileSync(file);
            if (existingConfig) {
                existingConfig = JSON.parse(existingConfig);
                existingConfig.baker = defaultConfig.baker;
    
                // Rewrite the file
                try {
                    fs.writeFileSync(file, JSON.stringify(existingConfig, null, '\t'));
                }
                catch (ex) {
                    throw "Could not append configuration file.";
                }
    
                console.log("Config file appended successfully.");
            }
            else {
                throw "Could not append configuration file."
            }
        }

    }

    /**
     * Get the config
     */
    this.get = function() {
        return config.get("baker");
    };
    
};
