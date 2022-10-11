import type { FC, ReactNode } from "react";
import { createElement } from "react";
// import * as styles from "./Version.css";

type VersionPropsType = {
  children: ReactNode;
};

const VersionDefaultProps: VersionPropsType = {
  children: createElement("div"),
};

export const Version: FC<VersionPropsType> = ({ children }) => (
  <>
    <div className="versionNumber">Version: {children}</div>
  </>
);
Version.defaultProps = VersionDefaultProps;

export default Version;
