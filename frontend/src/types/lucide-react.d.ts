declare module 'lucide-react' {
  import type * as React from 'react';

  export type LucideProps = React.SVGProps<SVGSVGElement> & {
    absoluteStrokeWidth?: boolean;
    size?: number | string;
    strokeWidth?: number | string;
  };

  export type LucideIcon = React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;

  export const ArrowUpLeft: LucideIcon;
  export const BadgeCheck: LucideIcon;
  export const BarChart3: LucideIcon;
  export const Boxes: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Cuboid: LucideIcon;
  export const Eye: LucideIcon;
  export const FileText: LucideIcon;
  export const FlaskConical: LucideIcon;
  export const Gift: LucideIcon;
  export const Heart: LucideIcon;
  export const ImageIcon: LucideIcon;
  export const Languages: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const LogOut: LucideIcon;
  export const Maximize2: LucideIcon;
  export const Menu: LucideIcon;
  export const MessageCircle: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const Minus: LucideIcon;
  export const MoonStar: LucideIcon;
  export const Package: LucideIcon;
  export const Pause: LucideIcon;
  export const Play: LucideIcon;
  export const Plus: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const Search: LucideIcon;
  export const Settings: LucideIcon;
  export const Shield: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const ShoppingCart: LucideIcon;
  export const Snowflake: LucideIcon;
  export const Sparkles: LucideIcon;
  export const ThumbsDown: LucideIcon;
  export const ThumbsUp: LucideIcon;
  export const TicketPercent: LucideIcon;
  export const User: LucideIcon;
  export const Users: LucideIcon;
  export const Warehouse: LucideIcon;
  export const Wind: LucideIcon;
  export const X: LucideIcon;
  export const ZoomIn: LucideIcon;
  export const ZoomOut: LucideIcon;
}
