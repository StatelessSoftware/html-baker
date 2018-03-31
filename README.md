# html-baker
Convert websites into flat-file websites

## Installation

```
npm i -g StatelessSoftware/html-baker
```

## Preperation

Create a config file `html-baker -c`
Edit the config file and make sure everything is proper.

## Usage

Run `html-baker`

### Force clean build

To remove the build and rebuild, run `html-baker -f`

## Configuration

- **precmd** - A command to run before the build starts
- **domains** - An array of domain urls to download
- **input** - If you have an app locally to download from, you can have it auto-start with these options
    - **directory** - Location of the app
    - **runcmd** - Command to run (start) the app. i.e. - `npm start`
- **output**
    - **directory** - Directory to bake into
    - **fixDotOnes** - (boolean) If html-baker should convert wget's .1 files to .html files
- **options** - Array of wget options
- **postcmd** - A command to run after the build succeeds