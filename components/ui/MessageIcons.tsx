import Svg, { Circle, Path, Rect } from "react-native-svg";

const SIZE = 28;

export function NotificationsIcon({ active }: { active?: boolean }) {
  const stroke = active ? "#6E63FF" : "#A9B4CC";
  const fill1 = active ? "#C9B6FF" : "#F3F6FC";
  const fill2 = active ? "#E9E1FF" : "#E7EDF8";
  const stroke2 = active ? "#A784FF" : "#A9B4CC";
  const stroke3 = active ? "#8F7BFF" : "#A9B4CC";

  return (
    <Svg width={SIZE} height={SIZE} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4.5 10.2v3.6"
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M7.8 9.15L16.15 5.8c1.03-.42 2.15.34 2.15 1.45v9.5c0 1.11-1.12 1.87-2.15 1.45L7.8 14.85V9.15Z"
        fill={fill1}
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M7.8 10.1H5.9A1.65 1.65 0 004.25 11.75v.5c0 .91.74 1.65 1.65 1.65h1.9"
        fill={fill2}
      />
      <Path
        d="M7.8 10.1H5.9A1.65 1.65 0 004.25 11.75v.5c0 .91.74 1.65 1.65 1.65h1.9"
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M17.9 9.3c.9.48 1.52 1.43 1.52 2.55 0 1.12-.62 2.07-1.52 2.55"
        stroke={stroke2}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M7.65 14.95l1.4 3.1c.21.47.68.77 1.19.77h.26c.58 0 1-.57.82-1.12l-1.1-3.3"
        stroke={stroke3}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SystemIcon({ active }: { active?: boolean }) {
  const stroke = active ? "#667BFF" : "#A9B4CC";
  const fill = active ? "#FFD8B0" : "#F3F6FC";
  const stroke2 = active ? "#FFB86C" : "#A9B4CC";

  return (
    <Svg width={SIZE} height={SIZE} viewBox="0 0 24 24" fill="none">
      <Rect
        x={5}
        y={6.3}
        width={14}
        height={10.6}
        rx={3.1}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.8}
      />
      <Path
        d="M9 3.9v2.1M15 3.9v2.1"
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Circle cx={9.5} cy={11.6} r={1.1} fill={stroke} />
      <Circle cx={14.5} cy={11.6} r={1.1} fill={stroke} />
      <Path
        d="M9.2 14.5c.9.78 2 .95 2.8.95s1.9-.17 2.8-.95"
        stroke={stroke2}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <Path
        d="M3.8 18.6h16.4"
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}
