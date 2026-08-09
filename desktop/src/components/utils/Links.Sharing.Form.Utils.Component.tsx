import { useEffect, useState, type FunctionComponent } from "react";
import {
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  RedditShareButton,
  EmailShareButton,
  TelegramShareButton,
  ThreadsShareButton,
  TwitterShareButton,
  TwitterIcon,
  ThreadsIcon,
  TelegramIcon,
  FacebookIcon,
  RedditIcon,
  LinkedinIcon,
  EmailIcon,
  WhatsappIcon,
} from "react-share";

interface ShareButtonsProps {
  url: string;
  title: string;
}

import CopyTextToClipboard from "../../functions/Copy.Text.To.Clipboard.Function";
import * as motion from "motion/react-client";
import { IoIosLink } from "react-icons/io";

const LinksSharingFormUtilsComponent: FunctionComponent<ShareButtonsProps> = ({
  url,
  title,
}) => {
  const [value, setValue] = useState<string>(url);

  // set the state for the value on render
  useEffect(() => {
    setValue(url);
  }, [url]);

  return (
    <motion.aside
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.1,
        scale: { type: "spring", visualDuration: 0.1, bounce: 0.1 },
      }}
      onClick={(event) => {
        if ((event.target as HTMLElement).click)
          event.stopPropagation(); // stop event propagation if clicked
        else return;
      }}
    >
      <div className="_wrapper">
        <span>Share your link via</span>
        <ul className="links-sharing-options-ul">
          {/* Facebook Share Button */}
          <li
            onClick={(event) => {
              if ((event.target as HTMLElement).click)
                event.stopPropagation(); // stop event propagation if clicked
              else return;
            }}
          >
            <FacebookShareButton url={url} title={title} formTarget="_blank">
              <FacebookIcon size={28} round />
            </FacebookShareButton>
          </li>

          {/* WhatsApp Share Button */}
          <li
            onClick={(event) => {
              if ((event.target as HTMLElement).click)
                event.stopPropagation(); // stop event propagation if clicked
              else return;
            }}
          >
            <WhatsappShareButton url={url} title={title} formTarget="_blank">
              <WhatsappIcon size={28} round />
            </WhatsappShareButton>
          </li>

          {/* Email Share Button */}
          <li
            onClick={(event) => {
              if ((event.target as HTMLElement).click)
                event.stopPropagation(); // stop event propagation if clicked
              else return;
            }}
          >
            <EmailShareButton url={url} title={title} formTarget="_blank">
              <EmailIcon size={28} round />
            </EmailShareButton>
          </li>

          {/* LinkedIn Share Button */}
          <li
            onClick={(event) => {
              if ((event.target as HTMLElement).click)
                event.stopPropagation(); // stop event propagation if clicked
              else return;
            }}
          >
            <LinkedinShareButton url={url} title={title} formTarget="_blank">
              <LinkedinIcon size={28} round />
            </LinkedinShareButton>
          </li>

          {/* Reddit Share Button */}
          <li
            onClick={(event) => {
              if ((event.target as HTMLElement).click)
                event.stopPropagation(); // stop event propagation if clicked
              else return;
            }}
          >
            <RedditShareButton url={url} title={title} formTarget="_blank">
              <RedditIcon size={28} round />
            </RedditShareButton>
          </li>

          {/* Twitter Share Button */}
          <li
            onClick={(event) => {
              if ((event.target as HTMLElement).click)
                event.stopPropagation(); // stop event propagation if clicked
              else return;
            }}
          >
            <TwitterShareButton url={url} title={title} formTarget="_blank">
              <TwitterIcon size={28} round />
            </TwitterShareButton>
          </li>

          {/* Threads Share Button */}
          <li
            onClick={(event) => {
              if ((event.target as HTMLElement).click)
                event.stopPropagation(); // stop event propagation if clicked
              else return;
            }}
          >
            <ThreadsShareButton url={url} title={title} formTarget="_blank">
              <ThreadsIcon size={28} round />
            </ThreadsShareButton>
          </li>

          {/* Telegram Share Button */}
          <li
            onClick={(event) => {
              if ((event.target as HTMLElement).click)
                event.stopPropagation(); // stop event propagation if clicked
              else return;
            }}
          >
            <TelegramShareButton url={url} title={title} formTarget="_blank">
              <TelegramIcon size={28} round />
            </TelegramShareButton>
          </li>
        </ul>
        <span>or copy link</span>
        <article>
          <p>
            <IoIosLink />
          </p>
          <input
            title={`${url}`}
            type="text"
            name="url"
            id="url"
            value={value}
            onChange={() => {
              setValue(url); // set the selected link to be shared as default value
            }}
          />
          <button
            type="button"
            className="copy-link-to-share-button"
            onClick={(event) => {
              if ((event.target as HTMLButtonElement).click) {
                event.stopPropagation(); // stop event propagation if clicked
                CopyTextToClipboard(url); // copy the select link url to the clipboard
              }

              // else do nothing
              return null;
            }}
          >
            copy
          </button>
        </article>
      </div>
    </motion.aside>
  );
};

export default LinksSharingFormUtilsComponent;
