import type { AmpConfig, AmpMediaType } from "./types";
import { fallbackConfig } from "./AmpStory";

export type AmpMediaPropsType = {
  component: AmpMediaType;
  config: AmpConfig;
};

const AmpMediaDefaultProps: AmpMediaPropsType = {
  component: {
    height: 0,
    width: 0,
    poster: "",
    src: "",
    type: "image",
  },
  config: fallbackConfig,
};

const AmpMedia = ({ component, config }: AmpMediaPropsType) => {
  const { height, poster, src, type, width } = component;
  const { mediaPath, imageDir, videoDir } = config;
  if (type === "video") {
    return (
      <amp-video
        width={width.toString()}
        height={height.toString()}
        layout="responsive"
        autoplay=""
        poster={`//${mediaPath}/${imageDir}/${poster}`}
      >
        <source src={`//${mediaPath}/${videoDir}/${src}`} type="video/mp4" />
      </amp-video>
    );
  }
  if (type === "image") {
    console.log("component: ", component);
    return (
      <amp-img
        alt="A view of the sea"
        src={`//${mediaPath}/${imageDir}/${src}`}
        width="1.33"
        height="1"
        layout="responsive"
      ></amp-img>
    );
  }
  return null;
};
AmpMedia.dafaultProps = AmpMediaDefaultProps;

export default AmpMedia;
