import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdSubscriptions } from "react-icons/md";

interface data {
  subscribed: string;
  verified: string;
}

import * as motion from "motion/react-client";

// user account subscription alert message component
export const SubscriptionAlertMessageComponent: React.FunctionComponent<
  data
> = ({ subscribed }) => {
  const [showAlert, setShowAlert] = useState(false);
  // Show the alert after 5 seconds if not subscribed
  useEffect(() => {
    if (subscribed === "true") return;
    const timer = setTimeout(() => setShowAlert(true), 5000);
    return () => clearTimeout(timer);
  }, [subscribed]);

  const isSubscribed = subscribed === "true";

  if (isSubscribed || !showAlert) {
    return null; // Hide if subscribed or timeout not reached
  }

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.1,
        scale: { type: "spring", visualDuration: 0.1, bounce: 0.1 },
      }}
      style={{
        width: "100%",
        height: "100%",
      }}
      className="user-account-subscription-alert-message"
      onClick={(event) => event.stopPropagation()}
    >
      <div>
        <div id="_wrapper">
          <span>
            <MdSubscriptions />
          </span>
          <h3>user account subscription</h3>
          <p>
            Make sure to choose a subscription plan of your🫵 choice to unlock
            features on linklist depending on your chosen plan.
          </p>
          <Link
            to={{
              pathname: "/account/subscription/plans",
            }}
          >
            <button type="button">subscribe</button>
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

// user account verification alert message component
import { MdSecurity } from "react-icons/md";
export const VerificationAlertMessageComponent: React.FunctionComponent<
  data
> = ({ verified }) => {
  const [showAlert, setShowAlert] = useState(false);
  // Show the alert after 5 seconds
  useEffect(() => {
    if (verified === "true") return;
    const timer = setTimeout(() => setShowAlert(true), 5000);
    return () => clearTimeout(timer);
  }, [verified]);

  // Check if the user is verified
  const isVerified = verified === "true";

  if (!isVerified || !showAlert) {
    return null; // Return null if the user is verified or timeout not reached
  }

  // else return or render the component to the DOM
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.1,
        scale: { type: "spring", visualDuration: 0.1, bounce: 0.1 },
      }}
      style={{
        width: "100%",
        height: "100%",
      }}
      className="user-account-verification-alert-message"
      onClick={(event) => event.stopPropagation()} // prevent event bubbling
    >
      <div>
        <div id="_wrapper">
          <span>
            <MdSecurity />
          </span>
          <h3>user account verification</h3>
          <p>
            Please make sure to verify your user account👨 using a verification
            code sent to your signup email to continue using linklist.
          </p>
          <Link
            to={{
              pathname: "/auth/verification",
            }}
          >
            <button type="button">Verify Account</button>
          </Link>
        </div>
      </div>
    </motion.article>
  );
};
