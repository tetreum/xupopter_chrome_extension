[![Preview](https://github.com/tetreum/xupopter_chrome_extension/master/preview.png)](https://github.com/tetreum/xupopter_chrome_extension/master/preview.png)

## Development

```bash
# install dependencies
npm i

# build files to `/dist` directory
# HMR for extension pages and content scripts
npm run dev

# Run test site locally
cd test && npx http-server --ssl;
```

## Build

```bash
# build files to `/dist` directory
$ npm run build
```


### How to add a new block

1. Create the block itself in `src/blocks`
2. List it on `src/components/LeftMenu.svelte`
3. List it on `src/models/IBlock.svelte`
4. List it on `src/blocks/Block.svelte`

## Test page

https://tetreum.github.io/xupopter_chrome_extension/
