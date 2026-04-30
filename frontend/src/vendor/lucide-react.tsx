import type { ComponentType, SVGProps } from 'react';

export type LucideProps = SVGProps<SVGSVGElement> & {
  absoluteStrokeWidth?: boolean;
  color?: string;
  size?: number | string;
  strokeWidth?: number | string;
};

export type LucideIcon = ComponentType<LucideProps>;

function makeIcon(label: string): LucideIcon {
  return ({ size = 24, strokeWidth = 2, color = 'currentColor', ...props }) => (
    <svg
      {...props}
      aria-label={props['aria-label'] || label}
      fill="none"
      height={size}
      role={props['aria-hidden'] ? undefined : 'img'}
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      width={size}
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </svg>
  );
}

export const Activity = makeIcon('activity');
export const AlertCircle = makeIcon('alert');
export const ArrowLeft = makeIcon('arrow left');
export const ArrowRight = makeIcon('arrow right');
export const Award = makeIcon('award');
export const BadgeCheck = makeIcon('badge check');
export const BarChart3 = makeIcon('bar chart');
export const Boxes = makeIcon('boxes');
export const Calendar = makeIcon('calendar');
export const Camera = makeIcon('camera');
export const Check = makeIcon('check');
export const CheckCircle2 = makeIcon('check circle');
export const ChevronDown = makeIcon('chevron down');
export const ChevronLeft = makeIcon('chevron left');
export const ChevronRight = makeIcon('chevron right');
export const Clock = makeIcon('clock');
export const Coffee = makeIcon('coffee');
export const CreditCard = makeIcon('credit card');
export const Cuboid = makeIcon('cuboid');
export const Edit = makeIcon('edit');
export const Eye = makeIcon('eye');
export const EyeOff = makeIcon('eye off');
export const FileText = makeIcon('file text');
export const Filter = makeIcon('filter');
export const FlaskConical = makeIcon('flask');
export const Gift = makeIcon('gift');
export const Heart = makeIcon('heart');
export const Home = makeIcon('home');
export const Image = makeIcon('image');
export const ImageIcon = makeIcon('image');
export const Languages = makeIcon('languages');
export const LayoutDashboard = makeIcon('dashboard');
export const Lock = makeIcon('lock');
export const LogOut = makeIcon('log out');
export const Menu = makeIcon('menu');
export const MessageCircle = makeIcon('message');
export const MessageSquare = makeIcon('message square');
export const Minus = makeIcon('minus');
export const MoonStar = makeIcon('moon');
export const Package = makeIcon('package');
export const PackageCheck = makeIcon('package check');
export const Pause = makeIcon('pause');
export const Play = makeIcon('play');
export const Plus = makeIcon('plus');
export const RotateCcw = makeIcon('rotate');
export const Save = makeIcon('save');
export const Search = makeIcon('search');
export const Settings = makeIcon('settings');
export const Shield = makeIcon('shield');
export const ShieldCheck = makeIcon('shield check');
export const ShoppingBag = makeIcon('shopping bag');
export const ShoppingCart = makeIcon('shopping cart');
export const Snowflake = makeIcon('snowflake');
export const Sparkles = makeIcon('sparkles');
export const Star = makeIcon('star');
export const ThumbsDown = makeIcon('thumbs down');
export const ThumbsUp = makeIcon('thumbs up');
export const TicketPercent = makeIcon('ticket percent');
export const Trash2 = makeIcon('trash');
export const TrendingUp = makeIcon('trending up');
export const Upload = makeIcon('upload');
export const User = makeIcon('user');
export const Users = makeIcon('users');
export const Warehouse = makeIcon('warehouse');
export const X = makeIcon('close');
