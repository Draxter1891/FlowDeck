import { useMediaQuery } from "../../hooks/useMediaQuery";
import DesktopBoard from "./DesktopBoard";
import MobileBoard from "./MobileBoard";

// Picks the layout once, here. 768px is Tailwind's `md`, the same line the toolbar uses.
export default function Board() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return isDesktop ? <DesktopBoard /> : <MobileBoard />;
}