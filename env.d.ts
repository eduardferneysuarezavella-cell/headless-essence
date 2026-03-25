/// <reference types="vite/client" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

import type {
  HydrogenContext,
  HydrogenSessionData,
  HydrogenEnv,
} from '@shopify/hydrogen';
import type { createAppLoadContext } from '~/lib/context';

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: {
    env: {
      NODE_ENV: 'production' | 'development';
      DATABASE_URL: string;
      KLAVYIO_API_KEY: string;
    }
  };

  interface Env extends HydrogenEnv {
    // declare additional Env parameter use in the fetch handler and Remix loader context here
    WEAVERSE_PROJECT_ID: string
    WEAVERSE_API_KEY: string
    KLAVYIO_API_KEY: string;
    GAMIFIERA_API_KEY: string;
    PUBLIC_GOOGLE_GTM_ID: string;
  }
}

declare module '@shopify/remix-oxygen' {
  interface AppLoadContext
    extends Awaited<ReturnType<typeof createAppLoadContext>> {
    // declare additional AppLoadContext parameter use in the Remix loader context here
  }

  interface SessionData extends HydrogenSessionData {
    // declare local additions to the Remix session data here
  }
}

declare global {
  interface Window {
    gmf: Function;
    _gmf: any[];
  }
}
