import type { FC } from "react";
import type { AmpConfig, AmpMediaType, AmpStoryLayerType } from "./types";
import AmpMedia from "./AmpMedia";
import { fallbackConfig } from "./AmpStory";

type AmpStoryLayerPropsType = {
  layer: AmpStoryLayerType;
  config: AmpConfig;
};

const AmpStoryLayerDefaultProps: AmpStoryLayerPropsType = {
  layer: {
    gridArea: "upperThird",
    template: "fill",
    component: [],
  },
  config: fallbackConfig,
};

const AmpStoryLayer: FC<AmpStoryLayerPropsType> = ({ layer, config }) => {
  const { template, component } = layer;
  return (
    <amp-story-grid-layer template={template}>
      {component.map((compo: AmpMediaType, idx: number) => (
        <AmpMedia key={idx} component={compo} config={config} />
      ))}
    </amp-story-grid-layer>
  );
};
AmpStoryLayer.defaultProps = AmpStoryLayerDefaultProps;

export default AmpStoryLayer;
