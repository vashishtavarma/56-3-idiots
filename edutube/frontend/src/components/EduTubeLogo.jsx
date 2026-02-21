import React from "react";
import { Link } from "react-router-dom";

/**
 * Shared EduTube logo (orb + text) matching the landing page style.
 * Use across Navbar, Auth, SignUp, Layout so branding is consistent.
 */
const EduTubeLogo = ({ asLink = true, className = "", size = "md" }) => {
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";
  const orbSize = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";

  const content = (
    <>
      <span
        className={`edutube-logo-orb flex-shrink-0 rounded-full ${orbSize}`}
        aria-hidden
      />
      <span className={`font-semibold whitespace-nowrap text-foreground ${textSize}`}>
        EduTube
      </span>
    </>
  );

  if (asLink) {
    return (
      <Link
        to="/"
        className={`flex items-center gap-2.5 text-foreground no-underline hover:opacity-90 transition-opacity ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      {content}
    </span>
  );
};

export default EduTubeLogo;
