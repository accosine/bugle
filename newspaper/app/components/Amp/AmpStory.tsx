import type { FC } from "react";
import type { AmpStoryType, AmpConfig } from "./types";
import AmpStoryPage from "./AmpStoryPage";

type AmpStoryPropsType = AmpStoryType & {
  config: AmpConfig;
};

export const fallbackConfig = {
  publisher: "NO PUBLISHER CONFIGURED",
  publisherLogo: "fallbacklogo.png",
  mediaPath: "",
  imageDir: "",
  videoDir: "",
};

const AmpStoryDefaultProps: AmpStoryPropsType = {
  title: "Missing Title",
  posterPortraitSrc: "",
  pages: [],
  config: fallbackConfig,
};

const AmpStory: FC<AmpStoryPropsType> = ({
  title,
  posterPortraitSrc,
  pages,
  config,
}) => {
  const [coverPage, ...mainPages] = pages;
  const { publisher, publisherLogo } = config;
  return (
    <amp-story
      standalone=""
      title={title}
      publisher={publisher}
      publisher-logo-src={`/${publisherLogo}`}
      poster-portrait-src={posterPortraitSrc}
    >
      <AmpStoryPage
        ampStoryPage={coverPage}
        name="cover"
        config={config}
      ></AmpStoryPage>
      {mainPages.map((page, idx: number) => (
        <AmpStoryPage
          key={idx}
          ampStoryPage={page}
          name={`page-${idx}`}
          config={config}
        ></AmpStoryPage>
      ))}
    </amp-story>
  );
};
AmpStory.defaultProps = AmpStoryDefaultProps;

export default AmpStory;
