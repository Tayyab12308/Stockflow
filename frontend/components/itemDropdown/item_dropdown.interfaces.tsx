export interface ItemDropdownProps<T> {
  selected: T;
  items: DropdownItems<T>[];
  onSelect: (value: T) => void;
  buttonClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
}

export interface DropdownItems<T> {
  value: T;
  label: string;
}