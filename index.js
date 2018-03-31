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

// Remove the directory first if -f is set
if (cli.force && config.output && config.output.directory) {
    console.log("Cleaning...");
    shell.execSync("rm -rf " + config.output.directory)
}

// Start the engine

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
    });
    server.stderr.on("data", (data) => {
        console.log(`Server Error: ${data}`);
        process.kill();
    });
    server.on("close", (code) => {
        console.log(`Server exited with code ${code}`);
        serverStarted = false;
        process.kill();
    })
    server.on("exit", (code) => {
        console.log(`Server exited with code ${code}`);
        serverStarted = false;
        process.kill();
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

    if (server) {
        server.kill();
    }
    process.exit();
    
}