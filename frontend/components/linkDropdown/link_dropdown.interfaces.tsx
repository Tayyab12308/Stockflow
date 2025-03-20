export interface LinkDropdownProps {
  title: DropdownTitle;
  items: DropdownItem[];
}

export interface DropdownTitle {
  label: string;
  injectedClassName?: string;
}

export interface DropdownItem {
  path: string;
  label: string;
  injectedClassName?: string;
}
