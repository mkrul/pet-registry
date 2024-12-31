export interface NavLinkProps {
  linkTo?: string;
  children: React.ReactNode;
  handler?: () => void;
  className?: string;
}
