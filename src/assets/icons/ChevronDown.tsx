import { SVGProps } from "react";
const ChevronDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    {...props}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export default ChevronDown;
