# Make Me Unsee This

This is a browser extension to black out some of the hate speech and offensive language. It uses a TensorFlow toxicity model (https://github.com/tensorflow/tfjs-models/tree/master/) to process and determine if the text passes the threshold of one of the labels. Otherwise, default actions check if text contains one of the triggering terms and blacks these snippets out.

## Why?

Sometimes you just want a nicer browsing experience.

## Development
Extension uses Webpack. Edit the code in `source`.
Once done, run `yarn run build`.
Then load the `distribution` in Chrome.

### Date

Oct 2020

### Other

This extension is a derivative of https://github.com/djacobow/blackouthate, which itself is a derivative of https://github.com/djacobow/detrumpify.
