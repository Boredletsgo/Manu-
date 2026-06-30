import Svg, { Circle, Line, Path, Rect } from "react-native-svg";

export type IconName =
  | "home"
  | "book"
  | "robot"
  | "bulb"
  | "chart"
  | "sparkle";

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * Brand-styled flat line icons (teal palette) used across the app in place of
 * emoji. Stroke-based so they tint cleanly for tab active/inactive states.
 */
export function Icon({
  name,
  size = 24,
  color = "#0d9488",
  strokeWidth = 2,
}: IconProps) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none" as const,
  };

  switch (name) {
    case "home":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 11l9-7 9 7" {...common} />
          <Path d="M5 9.5V20h14V9.5" {...common} />
          <Path d="M10 20v-5h4v5" {...common} />
        </Svg>
      );
    case "book":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M12 6.5C10.4 5.2 8.2 4.5 6 4.5c-.9 0-1.7.1-2 .2v13c.3-.1 1.1-.2 2-.2 2.2 0 4.4.7 6 2 1.6-1.3 3.8-2 6-2 .9 0 1.7.1 2 .2v-13c-.3-.1-1.1-.2-2-.2-2.2 0-4.4.7-6 2z"
            {...common}
          />
          <Line x1={12} y1={6.5} x2={12} y2={19.5} {...common} />
        </Svg>
      );
    case "robot":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Line x1={12} y1={3} x2={12} y2={6} {...common} />
          <Circle cx={12} cy={2.5} r={1.1} fill={color} stroke="none" />
          <Rect x={4} y={6} width={16} height={12} rx={3.5} {...common} />
          <Circle cx={9.5} cy={12} r={1.3} fill={color} stroke="none" />
          <Circle cx={14.5} cy={12} r={1.3} fill={color} stroke="none" />
          <Line x1={1.8} y1={11} x2={1.8} y2={14} {...common} />
          <Line x1={22.2} y1={11} x2={22.2} y2={14} {...common} />
        </Svg>
      );
    case "bulb":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M12 3a6 6 0 0 0-3.6 10.8c.5.4.85 1 .85 1.65V16h5.5v-.55c0-.65.35-1.25.85-1.65A6 6 0 0 0 12 3z"
            {...common}
          />
          <Line x1={9.75} y1={18.5} x2={14.25} y2={18.5} {...common} />
          <Line x1={10.5} y1={21} x2={13.5} y2={21} {...common} />
        </Svg>
      );
    case "chart":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M4 4v16h16" {...common} />
          <Path d="M7.5 14l3-3 3 2 4.5-5.5" {...common} />
          <Path d="M14.5 7.5h3.5V11" {...common} />
        </Svg>
      );
    case "sparkle":
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M12 3.5l1.7 4.8 4.8 1.7-4.8 1.7L12 16.5l-1.7-4.8L5.5 10l4.8-1.7z"
            fill={color}
            stroke="none"
          />
        </Svg>
      );
    default:
      return null;
  }
}
