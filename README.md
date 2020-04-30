# 📦 Webpack Shopify Theme Development Tool

**This Webpack config was created to replace Slate by Shopify. This workflow functions similiarly to Theme Kit but offers you the ability to use modern JavaScript and create template specific JS and CSS bundles. While it's possible to migrate an existing theme to this workflow, the intention and real benefit comes when new themes are built from scratch using this setup.**

## 🖥 System Requirements
- [Node](https://nodejs.org/en/) (v10.16.3+)
- [NPM 5+](https://docs.npmjs.com/try-the-latest-stable-version-of-npm)
- [Theme Kit](https://shopify.github.io/themekit/)

## 🎬 Getting Started
1. Download and unzip this repo, rename the directory to your project.
2. Open in terminal and and run `npm install` to install all node modules.
2. In a separate new directory, run [Theme Kit's 'new' command to generate a new theme on your store](https://shopify.github.io/themekit/commands/#new). After that theme has been uploaded to your store, delete the new folder containing the local theme files Theme Kit downloaded to your computer as you won't need them. The starter liquid files included `dist/` are the same files you'll get when generating a new theme with Theme Kit.
3. In Shopify, copy the theme ID for the new theme, then update the `<PASSWORD>`, `THEME_ID`, and `STORE_URL` in **config.yml** with your store & theme details.
4. Your `config.yml` file should look like this: 
    ```
    development:
      password: <PRIVATE_APP_PASSWORD>
      theme_id: "<THEME_ID>"
      store: <STORE_URL>
      directory: dist/
      ignore_files:
        - config/settings_data.json
    ```
5. If migrating an existing theme, copy over all assets, liquid and config files from your theme.
6. Run `npm start` to run your first Webpack build and start watching for file changes to be uploaded to Shopify.

## ⚙️ Configuration

### NPM

#### Scripts
`npm start`
- Completes a Webpack build in **development** mode
- Webpack begins watching for file changes
- Theme Kit begins watching for file changes in `dist/`
- Theme Kit opens your development theme in your default browser

`npm run build`
- Completes a Webpack build in **production** mode

`npm run deploy`
- Completes a Webpack build in **production** mode
- Deploys and overwrites all theme files via Theme Kit

`npm run eslint`
- Lint all JavaScript files in `src/js`

### Webpack

#### Entry Points
All JavaScript files in the `js/bundles` directory & subdirectories are used as entry points. All other JavaScript modules should added to additional subdirectories of `js/`. An entry point file must be created for each liquid template file, including alternate templates. A CSS file for each template and layout should also be added to `styles/layout` and `styles/templates`. These CSS files should be imported at the top of each JavaScript entry file.

#### Output Files
Webpack will generate a JavaScript file for each template and layout file in the `bundles` directory. The CSS files imported in each bundle entry file will also generate CSS files. Webpack will add all output files to `dist/assets`.

### Theme Kit

#### Config
The Theme Kit configuration file uses `dist` as the root directory for watching files to upload.

#### File Uploads
When running `npm start`, Webpack will use a plugin that runs `shopify-themekit watch` after a successful build. Webpack will then be set to watch and recompile file changes, and Theme Kit will watch for file changes in the `dist` directory.

## ‼️ Required Files
- The layout and template entry files in `src/js/bundles/` are necessary for Webpack to generate the CSS and JavaScript assets for each layout and template. Additional entry files will be required when creating new liquid templates or alternate templates, ie. `page.about.js`.
- The `style-bundle.liquid` and `script-bundle.liquid` snippets output dynamic asset URLs based on current layout and template. These have been added to sample `theme.liquid`. The `layout` variable is required.

#### Shopify Plus Stores
If your store is on Shopify Plus, you'll need to do the following:
- Create `checkout.scss` and add to `src/styles/layout/`.
- Create `checkout.js` and add to `src/js/bundles/layout/`.
- Add `import "Styles/layout/checkout.scss";` to `checkout.js`.
- Render these snippets in `checkout.liquid` by changing the snippet's layout variable to `checkout`. ie. `{% render 'style-bundle', layout: 'checkout' %}` and `{% render 'script-bundle', layout: 'checkout' %}`.

## 📝 Notes
- Subdirectories are allowed in `assets/`, `js/`, `styles/`, `snippets/`.
- A `Styles` module alias for the styles directory is ready to use. ie. `import "Styles/layout/theme.scss"`.
- To reference an asset url in an SCSS file such as a background image, just use `./filename.ext`, since all final CSS and images live in the `dist/assets/` directory.
- If you add a new JavaScript entry file to `js/bundles/` while Webpack and Theme Kit are watching for changes, you'll need to end the process and run `npm start` again so that Webpack is aware of the new entry file.
- A git pre-commit hook is installed that will run `webpack build` prior to the commit. This is useful if using a code deployment tool so that you never push and deploy an unbuilt theme.
- `clean-webpack-plugin` was intentionally not included to make incremental deployments faster using [Buddy](https://buddy.works/). If you remove a bundle entry file, you'll also need to delete the bundle files from `dist/assets`.
- If you update or switch node versions using `nvm`, you may need to run `npm rebuild node-sass` to refresh node-sass for your current environment.
- When merging 2 git feature branches, you only need to resolve the conlficts inside `src/`. Any conflicts inside `dist/` can be resolved with `npm run build`. Always run `npm run build` after resolving merge conflicts.

## 🚧 Under Construction
A few issues with this workflow that I'm working on a solution for:
- If a Webpack entry file is deleted, how to also remove the generated output files from `dist/assets/`. The `clean-webpack-plugin` removes the entire dist folder which git tracks as new changes to every file in the directory, so that is not an option.
- Currently, if the same vendor module is imported in a layout and template entry file, that code will be included twice. How to split out vendor file imports but also make them available in the necessary modules.

## 🆕 Changelog
Since this is not currently an NPM package, I'll be posting updates here that will need to be done manually.

#### March 2, 2020
- Adds `@babel/plugin-transform-runtime` dev dependency, and adds `"plugins": ["@babel/plugin-transform-runtime"]` to `.babelrc`.

#### March 10, 2020
- Fixes bug with account page style and JavaScript bundles. Updates the `style-bundle.liquid` and `script-bundle.liquid` snippets to remove `customers/` from the asset URL output as this is not included in the filename that webpack generates.

#### March 23, 2020
- Moves `templates/`, `sections/`, `snippets/` and `layout/` directories into a `liquid/` directory in `src/`.
- Updates copy plugin in `webpack.config.js` to accommodate the new liquid directory structure.