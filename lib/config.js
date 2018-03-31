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

        // Check for environment config file
        if (!fs.existsSync(file)) {
            let defaultConfig = require("../config.json");

            try {
                // Create file
                fs.writeFileSync(file,
                    JSON.stringify(
                        defaultConfig,
                        null,
                        '\t'
                    )
                );
            }
            catch (ex) {
                throw "Could not create configuration file.";
            }

        }
        else {
            console.log("Configuration file exists.  Will not overwrite.");
        }

    }

    /**
     * Get the config
     */
    this.get = function() {
        return config.get("baker");
    };
    
};
