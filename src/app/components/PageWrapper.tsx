"use client";

import { useEffect } from "react";

export default function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.style.backgroundColor = "rgb(17, 17, 17)";
  }, []);

  return <>{children}</>;
}
