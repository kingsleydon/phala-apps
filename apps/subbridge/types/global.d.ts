/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import '@total-typescript/ts-reset'
declare namespace NodeJS {
  interface ProcessEnv {
    // https://docs.netlify.com/configure-builds/environment-variables/#build-metadata
    readonly CONTEXT: 'production' | 'deploy-preview' | 'branch-deploy'
  }
}
