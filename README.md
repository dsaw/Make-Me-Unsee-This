# Make Me Unsee This

This is a browser extension to black out some of the hate speech and offensive language. It uses a TensorFlow toxicity model (https://github.com/tensorflow/tfjs-models/tree/master/) to process and determine if the text passes the threshold of one of the labels. Otherwise, default actions check if text contains one of the triggering terms and blacks these snippets out.

## Why?

Sometimes you just want a nicer browsing experience.

## Development
- Install the dependencies
`npm install`
- Edit the code in `source` during development.
- Once done, run
  `yarn run build`.
- To test, load the `distribution` folder in the browser.

### Date

Oct 2020

### Other

This extension is a derivative of https://github.com/djacobow/blackouthate, which itself is a derivative of https://github.com/djacobow/detrumpify.
