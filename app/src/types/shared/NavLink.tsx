export interface INavLink {
  linkTo?: string;
  children: React.ReactNode;
  handler?: () => void;
}
