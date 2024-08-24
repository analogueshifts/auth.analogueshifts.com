import { Suspense } from "react";
import Redirect from "@/components/application/redirect";

export default function Home() {
  return (
    <Suspense fallback={<p></p>}>
      <Redirect />
    </Suspense>
  );
}
