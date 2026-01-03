import React, { useEffect, useState } from 'react';

interface TypingEffectProps {
  text: string;
  speed?: number;
  className?: string;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ 
  text, 
  speed = 100, 
  className = '' 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Type the text once
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length) {
      // After typing is complete, hide the cursor after a delay
      const cursorTimeout = setTimeout(() => {
        setShowCursor(false);
      }, 1000);
      return () => clearTimeout(cursorTimeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <div className={`typing-text ${className}`}>
      {displayedText}
      {showCursor && <span className="cursor">|</span>}
    </div>
  );
};

export default TypingEffect;
