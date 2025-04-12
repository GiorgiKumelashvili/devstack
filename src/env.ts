import { PUBLIC_IS_DEV_MODE } from "$env/static/public";

const isProd = import.meta.env.PROD;
export const isDevMode = isProd ? false : PUBLIC_IS_DEV_MODE === "true";