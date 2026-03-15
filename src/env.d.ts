/// <reference types="@rsbuild/core/types" />

/**
 * Imports the SVG file as a React component.
 * @requires [@rsbuild/plugin-svgr](https://npmjs.com/package/@rsbuild/plugin-svgr)
 */
declare module "*.svg?react" {
  import type React from "react";
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

/**
 * Environment variables type definitions
 */
declare global {
  interface ImportMetaEnv {
    readonly PUBLIC_API_URL: string;
    readonly PUBLIC_PATIENT_PORTAL_URL: string;
    readonly PUBLIC_SUPABASE_URL: string;
    readonly PUBLIC_SUPABASE_ANON_KEY: string;
    readonly PUBLIC_DEV_BYPASS_AUTH?: string;
  }
}
