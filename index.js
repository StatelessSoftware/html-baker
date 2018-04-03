const shell = require("child_process");
const fs = require("fs");

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

// Remove the directory first if -f is set
if (cli.force && config.output && config.output.directory) {
    console.log("Cleaning...");
    shell.execSync("rm -rf " + config.output.directory)
}

// Start the engine

// Run the precmd
if (config.precmd && config.precmd.length) {
    console.log("Pre-cmd:", config.precmd);
    shell.execSync(config.precmd);
}

/// Check for input server command
let server = false;
let serverStarted = false;
let downloadStarted = false;
if (config.input && config.input.directory && config.input.runcmd) {

    // Run the command
    console.log("Starting server...");
    let cmd = config.input.runcmd;
    server = shell.exec(cmd, {
        "cwd": config.input.directory
    });

    server.stdout.on("data", (data) => {
        serverStarted = true;
        download();
        server.kill();
    });
    server.stderr.on("data", (data) => {
        console.log(`Server Error: ${data}`);
        server.kill();
    });
    server.on("close", (code) => {
        console.log(`Server exited with code ${code}`);
        process.exit();
    })
    server.on("exit", (code) => {
        console.log(`Server exited with code ${code}`);
        process.exit();
    })

}

/**
 * Run the download
 */
function download() {

    if (downloadStarted) {
        return;
    }
    else {
        downloadStarted = true;
    }

    /// Create wget options
    let wgetOptions = "";
    if (config.options && config.options.length) {
        wgetOptions = config.options.join(" ") + " ";
    }
    
    if (config.output && config.output.directory) {
        wgetOptions += "--directory-prefix=" + config.output.directory + " ";
        wgetOptions += "--no-host-directories ";
    }
    
    let wgetDomains = "";
    if (config.domains && config.domains.length) {
        wgetDomains = config.domains.join(" ");
        
        wgetOptions += "-d " + wgetDomains + " ";
    }
    
    let wgetcmd = "";
    if (wgetOptions.length && wgetDomains.length) {
        wgetcmd = "wget " + wgetOptions + wgetDomains
    }
    else if (!wgetOptions.length) {
        throw "Could not read options";
    }
    else if (!wgetDomains.length) {
        throw "Could not read domains.";
    }
    
    /// Run wget
    if (wgetcmd.length && serverStarted) {
        console.log("Running " + wgetcmd);
    
        try {
            shell.execSync(wgetcmd);

            // Run the post command
            if (config.postcmd && config.postcmd.length) {
                console.log("Post-cmd:", config.postcmd);
                shell.execSync(config.postcmd);
            }

            // Fix dot ones
            if (config.output && config.output.fixDotOnes) {

                // Scan the directory
                fs.readdirSync(config.output.directory).forEach(file => {
                    if (file.includes(".1.html")) {

                        file = config.output.directory + '/' + file;
                        let newfile = file.replace(".1.html", ".html");
                        
                        try {
                            fs.renameSync(file, newfile);
                        }
                        catch (ex) {
                            throw "Could not move file " + file;
                        }
                    }                    
                });

            }

            console.log("Done.");
        }
        catch (ex) {
            console.log("Error: ", ex);
        }
    
    }
    else {
        // Server not started
        console.log("Server wasn't started.");
    }
    
}
