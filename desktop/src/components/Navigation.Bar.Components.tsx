// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import displayElement from "../functions/Display.Element.Function";
// import userAccountProfileReviewComponent from "./User.Account.Profile.Review.Component";
// import { NotificationsSideBarComponent } from "./Side.Bars.Components";
// // import { MdOutlineAccountCircle } from "react-icons/md";

// // check whether cookies are accepted
// const CookiesAccepted: boolean = window.document.cookie.includes(
//   "cookiesAccepted"
// ) as boolean;

// // Define the shape of a trashed link item
// type ListItemProperties = {
//   id: string;
//   title: string;
//   link: string;
//   user_id: string;
// };

// // Define the shape of the user authentication object from context
// interface ProfileProps {
//   date: string;
//   message: string;
//   request_id: string;
//   status_code: string;
//   data: {
//     id: string;
//     username: string;
//     avatar: string;
//     email: string;
//     token: string;
//     subscribed: string;
//     verified: string;
//     saved_links: ListItemProperties[];
//     trashed_links: ListItemProperties[];
//     saved_links_count: number;
//     trashed_links_count: number;
//   };
// }

// // Define the shape of the secondary authentication object
// interface userAuthenticationProps {
//   date: string;
//   message: string;
//   request_id: string;
//   status_code: string;
//   data: {
//     token: string;
//   };
// }

// import userAuthenticationContext from "../context/user.Authentication.Context";
// import { IoNotificationsOutline } from "react-icons/io5";
// import { BiMenuAltLeft } from "react-icons/bi";
// import LinksShareButtonsComponent from "./Sharing.Buttons.Components";
// import { BiShareAlt } from "react-icons/bi";

// interface contentProps {
//   subscription_type: string;
// }

// export const DashboardPageNavigationBarComponent: React.FunctionComponent<
//   contentProps
// > = ({ subscription_type }) => {
//   // State to hold the user profile data
//   const [profile, setProfile] = useState<ProfileProps>({} as ProfileProps);
//   // Get the user authentication data from context
//   // This context provides the user's authentication details
//   const userAuthentication: userAuthenticationProps = React.useContext(
//     userAuthenticationContext
//   ) as userAuthenticationProps;

//   // set state for the profile review component rendering
//   const [showProfile, setShowProfile] = useState<boolean>(false);
//   // set state for showing the links share buttons components
//   // This state controls the visibility of the links share buttons components
//   const [showLinksShareButtonsComponents, setShowLinksShareButtonsComponents] =
//     useState<boolean>(false);

//   // Effect to fetch the user profile when the component mounts or when the token changes
//   // This effect runs only when the user token is available
//   useEffect(() => {
//     (async function fetchProfile() {
//       try {
//         // Fetch the user profile using the token from context
//         const { data: response } = await axios.get(
//           `${import.meta.env.VITE_GET_user_PROFILE_API_ENDPOINT}`,
//           {
//             headers: {
//               Authorization: `Bearer ${userAuthentication?.data?.token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (response.status_code === 200) {
//           // Set the profile state with the fetched data
//           setProfile(response);
//           setShowProfile(true as boolean);
//         } else {
//           setShowProfile(false as boolean);
//         }
//       } catch (error) {
//         setShowProfile(false as boolean);
//         console.error("Error fetching user data:", error);
//       }
//     })();
//     // Run the effect only when the user token is available
//   }, [userAuthentication?.data?.token]);

//   // Show the notifications sidebar when the notifications button is clicked
//   const handleNotificationsClick = (event: React.MouseEvent) => {
//     event.stopPropagation(); // prevent event bubbling
//     // Toggle the visibility of the notifications sidebar
//     const notificationsSidebar = document.querySelector(
//       ".notifications-side-bar-component"
//     ) as HTMLElement;
//     if (notificationsSidebar) displayElement(notificationsSidebar);
//   };

//   // Show the user profile review sidebar when the avatar is clicked
//   const handleProfileClick = (event: React.MouseEvent) => {
//     event.stopPropagation(); // prevent event bubbling

//     const profileSidebar = document.querySelector(
//       ".user-account-profile-review-side-bar"
//     ) as HTMLElement;
//     if (profileSidebar) displayElement(profileSidebar);
//   };

//   // Render the navigation bar with left and right content
//   return (
//     <>
//       {/* Sidebar for user profile review (hidden by default) */}
//       {!showProfile && <userAccountProfileReviewComponent profile={profile} />}
//       <NotificationsSideBarComponent />
//       {/* Share link buttons component */}
//       {showLinksShareButtonsComponents && (
//         <div
//           className="links-sharing-buttons-container"
//           onClick={(event) => {
//             event.stopPropagation(); // stop event propagation
//             setShowLinksShareButtonsComponents(false);
//           }}
//         >
//           <LinksShareButtonsComponent
//             url={"https://linklists.netlify.app"}
//             title={"Linklist.app"}
//           />
//         </div>
//       )}

//       {/* Navigation Bar */}
//       <nav className="dashboard-page-navigation-bar-component">
//         <Link
//           to={{
//             pathname: "/users/feedback",
//             search: `page=feedbacks&visible=true&authorized=true&scale=1.1&cookies-accepted=${CookiesAccepted}`,
//           }}
//         >
//           <button
//             type="button"
//             id="feedbacks-nav-button"
//             title="send a feedback to linklist developers"
//           >
//             <MdFeedback />
//           </button>
//         </Link>
//         <button
//           type="button"
//           className="show-side-bar-button"
//           onClick={(event: React.MouseEvent) => {
//             event.stopPropagation(); // stop event bubbling on immediate click
//             const element: HTMLElement = window.document.querySelector(
//               ".mobile-view-dashboard-page-side-bar-component"
//             ) as HTMLElement;
//             displayElement(element); // display side bar
//           }}
//         >
//           <BiMenuAltLeft />
//         </button>
//         <article>
//           {/* Right Content: Add Link, Notifications, and Profile Avatar */}
//           <div className="dashboard-page-navigation-bar-component-right-content-wrapper">
//             <span>{subscription_type ?? "free"}</span>
//             <button
//               type="button"
//               className="dashboard-page-navigation-bar-share-button"
//               title="Share linklist via media"
//               onClick={(event: React.MouseEvent) => {
//                 event.stopPropagation(); // stop event bubbling
//                 setShowLinksShareButtonsComponents(true);
//               }}
//             >
//               <BiShareAlt />
//             </button>
//             <button
//               type="button"
//               className="dashboard-page-navigation-bar-notification-button"
//               title="Check new notifications"
//               onClick={handleNotificationsClick}
//             >
//               <IoNotificationsOutline />
//             </button>
//             {/* user Avatar */}
//             <img
//               src={`/avatars/${profile?.data?.avatar ?? "avatar-2.webp"}`}
//               alt="user avatar"
//               onClick={handleProfileClick}
//             />
//           </div>
//         </article>
//       </nav>
//     </>
//   );
// };

// import { Link } from "react-router-dom";
// import { BiLink } from "react-icons/bi";
// import { MdFeedback } from "react-icons/md";

// export const SecondaryNavigationBarComponent: React.FunctionComponent = () => {
//   return (
//     <>
//       <nav
//         className={String(
//           "secondary-navigation-bar-component"
//         ).toLocaleLowerCase()}
//       >
//         <div>
//           <Link
//             to={{
//               pathname: "/",
//             }}
//           >
//             <BiLink />
//             Linklist.app
//           </Link>
//         </div>
//       </nav>
//     </>
//   );
// };

// export const LandingPageNavigationBarComponent: React.FunctionComponent =
//   () => {
//     return (
//       <>
//         <nav
//           className={String(
//             "home-page-navigation-bar-component"
//           ).toLocaleLowerCase()}
//         >
//           <div>
//             <Link
//               className="logo"
//               to={{
//                 pathname: "/",
//               }}
//             >
//               <BiLink /> Linklist.app
//             </Link>
//             <ul>
//               <li>
//                 <Link
//                   to={{
//                     pathname: "/",
//                   }}
//                 >
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to={{
//                     pathname: "/account/subscription/plans",
//                   }}
//                 >
//                   Prices
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to={{
//                     pathname: "/users/feedback",
//                   }}
//                 >
//                   Feedbacks
//                 </Link>
//               </li>
//             </ul>
//             <Link
//               to={{
//                 pathname: "/auth/login",
//                 search: "query=login&form=password&email",
//               }}
//             >
//               <button type="button">Log In</button>
//             </Link>
//           </div>
//         </nav>
//       </>
//     );
//   };
