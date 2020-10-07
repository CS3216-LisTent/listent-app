import React, { Suspense } from "react";

// Custom components
import LoadingCenter from "./LoadingCenter";

export default function SuspenseLoading({ children, ...rest }) {
  return (
    <Suspense {...rest} fallback={<LoadingCenter />}>
      {children}
    </Suspense>
  );
}
