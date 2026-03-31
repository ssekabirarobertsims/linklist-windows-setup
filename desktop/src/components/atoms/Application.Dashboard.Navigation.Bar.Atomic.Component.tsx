import { type FunctionComponent } from "react";
// import { FaCaretDown } from "react-icons/fa";

interface propTypes {
  window: string;
}

import { RiMenu2Line } from "react-icons/ri";

const ApplicationDashboardNavigationBarAtomicComponent: FunctionComponent<
  propTypes
> = ({ window }) => {
  return (
    <>
      <nav>
        <article>
          <div id="_a">
            <button type="button" title="show/hide menu">
              <RiMenu2Line />
            </button>
            <span>{window}</span>
          </div>
          <div id="_b">
            {/* <img src="/avatars/avatar-1.webp" alt="" />
            <span>
              ssekabira robert <FaCaretDown />
            </span> */}
          </div>
        </article>
      </nav>
    </>
  );
};

export default ApplicationDashboardNavigationBarAtomicComponent;
