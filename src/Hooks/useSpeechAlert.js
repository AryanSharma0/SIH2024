import { useEffect, useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";

// Custom Hook: useSpeechAlert
export default function useSpeechAlert(alert) {
  const { speak } = useSpeechSynthesis();
  const [openAccident, setOpenAccident] = useState(false);

  useEffect(() => {
    if (alert) {
      setOpenAccident(true);
      speak({ text: alert });
      const timeId = setTimeout(() => {
        setOpenAccident(false);
      }, 2000);

      return () => clearTimeout(timeId);
    }
  }, [alert, speak]);

  return openAccident;
}
