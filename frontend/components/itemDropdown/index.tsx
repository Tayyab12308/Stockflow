import React, { useState } from 'react';
import { DropdownItems, ItemDropdownProps } from './item_dropdown.interfaces';

const ItemDropdown = <T extends React.ReactNode,>({
  selected,
  items,
  onSelect,
  buttonClassName = '',
  menuClassName = '',
  itemClassName = '',
}: ItemDropdownProps<T>) => {
  const [open, setOpen] = useState<boolean>(false);

  const toggleDropdown = (): void => setOpen((prev) => !prev);

  // Close dropdown on blur after a short delay (to allow click event)
  const handleBlur = (): void => {
    setTimeout(() => setOpen(false), 150);
  };

  return (
    <div className={`item-dropdown ${itemClassName}`} onBlur={handleBlur} tabIndex={0}>
      <button className={`item-dropdown-toggle ${buttonClassName}`} onClick={toggleDropdown}>
        {selected}
        <svg
          className={`item-caret ${open ? 'open' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 542 332"
          width="12"
          height="12"
        >
          <path
            fill="currentColor"
            d="M30.812925,33.675850 
              C43.275089,27.440134 53.707909,29.232794 63.766109,39.279449 
              C98.895157,74.368172 133.986908,109.494240 169.093201,144.605728 
              C202.785797,178.303314 236.483994,211.995300 270.150299,245.719131 
              C271.311188,246.882019 272.155365,248.361099 273.355042,249.971863 
              C275.515778,247.919327 276.956757,246.610825 278.331390,245.236038 
              C346.778534,176.782089 415.217407,108.319862 483.665039,39.866390 
              C493.727142,29.803406 504.827911,27.411533 515.735291,32.889740 
              C530.268433,40.188984 534.508362,58.754845 524.523010,71.572495 
              C523.095337,73.405113 521.467957,75.096718 519.822510,76.743050 
              C444.793030,151.809982 369.753143,226.866547 294.709045,301.918854 
              C281.207764,315.421570 266.802887,315.431854 253.318176,301.945801 
              C178.037994,226.658295 102.755287,151.373337 27.495592,76.065353 
              C13.677098,62.237991 14.972235,44.692116 30.812925,33.675850 
              z"
          />
        </svg>
      </button>
      {open && (
        <ul className={`item-dropdown-menu ${menuClassName}`}>
          {items.map((item: DropdownItems<T>, index: number): React.JSX.Element => (
            <li key={index} className="item-dropdown-item">
              <button
                onClick={() => {
                  onSelect(item.value);
                  setOpen(false);
                }}
                className="item-dropdown-link"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemDropdown;