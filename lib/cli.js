const getCommandLine = require("command-line-args");

module.exports = function() {
    return getCommandLine([
        {
            name: "createConfig",
            alias: "c",
            type: Boolean,
        },
        {
            name: "force",
            alias: "f",
            type: Boolean,
        }
    ]);
};
