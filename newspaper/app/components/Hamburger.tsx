type HamburgerType = {
  open: boolean;
  handleClick: () => void;
};

const HamburgerDefaultProps: HamburgerType = {
  open: false,
  handleClick: () => {
    console.error("Hamburger is missing a click handler");
  },
};

const Hamburger = ({ open, handleClick }: HamburgerType) => (
  <>
    <div
      onClick={handleClick}
      id="hamburger"
      className={`${open ? "open" : "close"}`}
      role="button"
      tabIndex={0}
    >
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </>
);
Hamburger.defaultProps = HamburgerDefaultProps;
Hamburger.displayName = "Hamburger";

export default Hamburger;
