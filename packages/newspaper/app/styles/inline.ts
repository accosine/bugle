import type { ConfigType } from "~/config.server";

const cssVars = ({ backgroundColor }: Partial<ConfigType>) => `
  :root {
    --main-bg-color: ${backgroundColor};
  }
`;
export default cssVars;
