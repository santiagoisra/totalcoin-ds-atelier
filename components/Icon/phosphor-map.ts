/**
 * Mapping de iconos GENERICOS que usan Phosphor Icons (@phosphor-icons/react).
 *
 * Convencion: los nombres kebab-case del DS de TotalCoin mapean a componentes de
 * Phosphor que cubren el mismo significado semantico. El estilo visual es similar
 * pero no 100% identico — Phosphor "regular" weight matchea el stroke 1.5 del DS.
 *
 * Para iconos dominio-especifico (MoneyIn, Loan, CreditAdjust, etc.) se usa
 * `figma-icons.ts` — SVGs extraidos directamente del DS de Figma.
 */

import {
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  ArrowsClockwise, ArrowsLeftRight, ArrowSquareOut,
  Bell, Calendar, CaretDown, CaretLeft, CaretRight, CaretUp,
  Check, CheckCircle, Clock, Copy, CreditCard, CurrencyDollar,
  DotsThree, DotsThreeVertical, DownloadSimple,
  Envelope, Eye, EyeSlash, File as FileIcon, Folder, FunnelSimple,
  Gear, Heart, House, Image as ImageIcon, Info,
  Link as LinkIcon, List, Lock, LockOpen, MagnifyingGlass, Minus, Moon,
  PencilSimple, Phone, Plus, Share, SignIn, SignOut, SpeakerHigh, SpeakerSlash,
  Star, Sun, Tag, Trash, UploadSimple, User, UserPlus, UsersThree,
  Wallet, Warning, X, XCircle,
} from "@phosphor-icons/react";

export const PHOSPHOR_ICONS = {
  // navigation
  "check": Check,
  "close": X,
  "x": X,
  "chevron-up": CaretUp,
  "chevron-down": CaretDown,
  "chevron-left": CaretLeft,
  "chevron-right": CaretRight,
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,
  "arrow-left": ArrowLeft,
  "arrow-right": ArrowRight,
  "menu": List,
  "more-horizontal": DotsThree,
  "more-vertical": DotsThreeVertical,
  "external-link": ArrowSquareOut,
  // actions
  "search": MagnifyingGlass,
  "plus": Plus,
  "minus": Minus,
  "trash": Trash,
  "edit": PencilSimple,
  "share": Share,
  "copy": Copy,
  "download": DownloadSimple,
  "upload": UploadSimple,
  "refresh": ArrowsClockwise,
  "filter": FunnelSimple,
  "link": LinkIcon,
  // generic transfer (vs dominio-especifico arrows-transfer-*)
  "transfer": ArrowsLeftRight,
  // domain (shape)
  "home": House,
  "house": House,
  "user": User,
  "users": UsersThree,
  "user-plus": UserPlus,
  "bell": Bell,
  "mail": Envelope,
  "phone": Phone,
  "heart": Heart,
  "star": Star,
  "wallet": Wallet,
  "credit-card": CreditCard,
  "dollar": CurrencyDollar,
  "tag": Tag,
  "calendar": Calendar,
  "clock": Clock,
  "file": FileIcon,
  "folder": Folder,
  "image": ImageIcon,
  // system
  "settings": Gear,
  "lock": Lock,
  "unlock": LockOpen,
  "login": SignIn,
  "logout": SignOut,
  "moon": Moon,
  "sun": Sun,
  "volume": SpeakerHigh,
  "volume-off": SpeakerSlash,
  // feedback
  "info": Info,
  "alert-triangle": Warning,
  "x-circle": XCircle,
  "circle-check": CheckCircle,
  // input
  "eye": Eye,
  "eye-closed": EyeSlash,
} as const;

export type PhosphorIconName = keyof typeof PHOSPHOR_ICONS;
