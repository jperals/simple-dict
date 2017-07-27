# simple-dict

Simple, yaml-based term-definition dictionary.

This is a micro-project I set up for myself just to show off my daughter's first ca. 100 words.

I set up a nice workflow based on Gulp, Express and React in order to make it simple to add terms and to edit the codebase as well.

## Setup

To install all dependencies:
```
npm install
```

### Development

Just run
```
gulp serve
```
then visit e.g. `localhost:3000?dict=laia-ca`, where the `dict` query parameter refers to the dictionary in `data/laia-ca.yaml`. The Express server will reload automatically on changes. (The browser won't, yet)

### Genereate a build

Just run
```
gulp build
```
which will generate a static build under `static` for all existing dictionaries. You can then publish to any static hosting provider, like Github Pages.

### Edit and create new dictionaries

Dictionaries are written in yaml and live under `data`. You can take the existing one as a reference.
