/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LEEWAY_RTC_SDK_ENTRY?: string;
  readonly VITE_ENABLE_RTC_CAMERA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}