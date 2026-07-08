import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const CustomCursor = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isAdminPage) return;
    // 1. PERFORMANCE BOOST: Don't run the cursor script on mobile screens (under 768px)
    if (window.innerWidth < 768) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // Mouse target position
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Current cursor position
    let currentX = mouseX;
    let currentY = mouseY;

    let animationFrame;

    // Smooth animation loop
    const animate = () => {
      // Increase/decrease 0.15 for more/less smoothness
      currentX += (mouseX - currentX) * 0.17;
      currentY += (mouseY - currentY) * 0.17;

      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseOver = (e) => {
      const target = e.target;

      const isInteractable = !!target.closest(
        'a, button, input, textarea, select, [role="button"], [data-cursor]'
      );

      setIsHovering(isInteractable);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isAdminPage]);

  if (isAdminPage) return null;

  return (
    <div
      ref={cursorRef}
      // 2. CSS HIDE: Added 'hidden md:block' so it physically disappears on mobile
      className={`hidden md:block fixed top-0 left-0 pointer-events-none z-[99999] rounded-full  transition-all duration-300 ease-out
      ${
        isHovering
          ? "w-20 h-20 bg-[#0D2B4E]/30 shadow-lg"
          : "w-10 h-10 bg-[#C8A64D]/20 "
      }`}
      style={{
        willChange: "transform",
      }}
    />
  );
};

export default CustomCursor;