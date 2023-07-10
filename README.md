### How to operate

To build the files, you have two defined scripts:

- `pnpm dev`: Builds and creates a local server that serves all files (check [Serving files on development mode](#serving-files-on-development-mode) for more info).
- - If you want to run localhost on your end as well add "isStagingForMe" to localStorage = `localStorage.setItem('isStagingForMe', true)`

- `pnpm build`: Builds to the production directory (`dist`).
- - Every time new build is published to GitHub - Draft The New Release - Create a new Tag - Update the Tag in Global Settings / Custom Code / Footer Code / var version = "X.X.X"
