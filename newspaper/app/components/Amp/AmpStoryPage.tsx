import type { FC } from "react";
import type { AmpStoryPageType, AmpStoryLayerType, AmpConfig } from "./types";
import AmpStoryLayer from "./AmpStoryLayer";
import { fallbackConfig } from "./AmpStory";

type AmpStoryPagePropsType = {
  ampStoryPage: AmpStoryPageType;
  name: string;
  config: AmpConfig;
};

const AmpStoryPageDefaultProps: AmpStoryPagePropsType = {
  ampStoryPage: {
    id: 0,
    backgroundAudio: "",
    autoAdvanceAfter: "5",
    layers: [],
  },
  name: "no name",
  config: fallbackConfig,
};

const AmpStoryPage: FC<AmpStoryPagePropsType> = ({
  ampStoryPage,
  config,
  name,
}) => {
  // TODO: Add optinal background audio
  // const { id, backgroundAudio } = ampStoryPage;
  const { layers } = ampStoryPage;
  return (
    <amp-story-page id={name}>
      {layers.map((layerCover: AmpStoryLayerType, idx: number) => (
        <AmpStoryLayer
          key={idx}
          layer={layerCover}
          config={config}
        ></AmpStoryLayer>
      ))}
    </amp-story-page>
  );
};
AmpStoryPage.defaultProps = AmpStoryPageDefaultProps;

export default AmpStoryPage;
