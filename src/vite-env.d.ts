/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Web3Forms access key — when set, the contact form emails enquiries via Web3Forms. */
  readonly VITE_WEB3FORMS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
