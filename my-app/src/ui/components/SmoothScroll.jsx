import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

const SmoothScroll = ({ children }) => {
  const location = useLocation();
  const lenisRef = useRef(null);

  // Exclude dashboard, admin, and invoice pages from smooth scrolling
  const isDisabled =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/invoice");

  useEffect(() => {
    if (isDisabled) return;

    // Register ScrollTrigger with GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Synchronize Lenis with GSAP's ticker
    const updateLoop = (time) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };

    gsap.ticker.add(updateLoop);

    // Disable GSAP lag smoothing to keep scrolling synchronized
    gsap.ticker.lagSmoothing(0);

    // Force recalculating ScrollTrigger positions
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(updateLoop);
    };
  }, [isDisabled]);

  // Handle route transitions
  useEffect(() => {
    if (isDisabled) return;

    const lenisInstance = lenisRef.current?.lenis;
    if (lenisInstance) {
      // Instantly scroll to the top of the new page
      lenisInstance.scrollTo(0, { immediate: true });

      // Refresh ScrollTrigger positions after page renders
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, isDisabled]);

  if (isDisabled) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        lerp: 0.1,
        duration: 1.2,
        syncTouch: true,
        autoRaf: false, // Prevent Lenis from running its own RAF loop
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
