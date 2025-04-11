// ThemeManager.js
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers/root_reducer';

const ThemeManager = () => {
  const darkThemeEnabled = useSelector((state: RootState) => state.ui.darkTheme);
  
  useEffect(() => {
    if (darkThemeEnabled) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [darkThemeEnabled]);
  
  return null;
};

export default ThemeManager;