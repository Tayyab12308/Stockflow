import React, { useState, useEffect } from 'react';

interface AnimatedDigitProps {
  digit: string;
  animationDuration?: number;
  globalDirection: 'up' | 'down';
  digitInjectedClassName?: string;
}

const AnimatedDigit: React.FC<AnimatedDigitProps> = ({
  digit,
  animationDuration = 2000, // 2000ms as requested
  globalDirection,
  digitInjectedClassName,
}) => {
  const [currentDigit, setCurrentDigit] = useState<string>(digit);
  const [previousValue, setPreviousValue] = useState<string>(digit);
  const [animating, setAnimating] = useState<boolean>(false);
  const [animationSteps, setAnimationSteps] = useState<string[]>([]);

  useEffect(() => {
    if (digit === currentDigit) return;

    const startValue = Number(currentDigit);
    const endValue = Number(digit);

    if (startValue === endValue) return;

    // Calculate all steps between start and end values
    const step = endValue > startValue ? 1 : -1;
    const steps: string[] = [];
    for (let v = startValue + step; step > 0 ? v <= endValue : v >= endValue; v += step) {
      steps.push(v.toString());
    }
    setAnimationSteps(steps);

    // Divide total duration across steps
    const stepDuration = animationDuration / (steps.length || 1);

    // Animate each step sequentially
    const animateStep = (index: number) => {
      if (index >= steps.length) {
        setCurrentDigit(digit);
        setAnimationSteps([]);
        return;
      }

      setPreviousValue(currentDigit);
      setCurrentDigit(steps[index]);
      setAnimating(true);

      setTimeout(() => {
        setAnimating(false);
        setTimeout(() => animateStep(index + 1), 50); // Small delay between steps
      }, stepDuration);
    };

    animateStep(0);
  }, [digit, animationDuration]);

  // Determine animation direction for the current step
  const animDirection = Number(currentDigit) > Number(previousValue) ? 'up' : 'down';

  return (
    <div className="digit-container">
      <span
        className={`digit-wrapper ${animating ? 'animating' : ''}`}
        style={{
          color: animating ? (globalDirection === 'up' ? 'green' : 'red') : 'white',
        }}
      >
        {animating ? (
          <>
            <span
              key={`old-${previousValue}`}
              className="digit old-digit"
              style={{
                animation: `${
                  animDirection === 'down' ? 'slide-up-old' : 'slide-down-old'
                } ${animationDuration / (animationSteps.length || 1)}ms linear forwards`,
              }}
            >
              {previousValue}
            </span>
            <span
              key={`new-${currentDigit}`}
              className="digit new-digit"
              style={{
                animation: `${
                  animDirection === 'down' ? 'slide-up-new' : 'slide-down-new'
                } ${animationDuration / (animationSteps.length || 1)}ms linear forwards`,
              }}
            >
              {currentDigit}
            </span>
          </>
        ) : (
          <span key={`static-${currentDigit}`} className={`digit ${digitInjectedClassName}`}>
            {currentDigit}
          </span>
        )}
      </span>
    </div>
  );
};

export default AnimatedDigit;