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

- **domains** - An array of domain urls to download
- **input** - If you have an app locally to download from, you can have it auto-start with these options
    - **directory** - Location of the app
    - **runcmd** - Command to run (start) the app. i.e. - `npm start`
- **output**
    - **directory** - Directory to bake into
- **options** - Array of wget options
