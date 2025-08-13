import { useState } from "react";

export const use_app_state = () => {
  const [dark_mode, set_dark_mode] = useState(false);
  const [language, set_language] = useState('ko');
  
  return { dark_mode, set_dark_mode, language, set_language };
};