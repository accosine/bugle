import { createDangerousMarkup } from "./boilerplate";

export const AmpBoilerplateStyle = ({ styl }: { styl: string }) => (
  <style
    amp-boilerplate=""
    dangerouslySetInnerHTML={createDangerousMarkup(styl)}
  />
);
export default AmpBoilerplateStyle;
