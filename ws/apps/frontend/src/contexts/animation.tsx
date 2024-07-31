import { createContext, useContext, useEffect, useRef } from 'react';

type AnimationFrameCallback = (deltaTime: number) => void;

interface AnimationContextType {
  registerAnimation: (callback: AnimationFrameCallback) => void;
  unregisterAnimation: (callback: AnimationFrameCallback) => void;
}

const AnimationContext = createContext<AnimationContextType | null>(null);

const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const callbacksRef = useRef<Set<AnimationFrameCallback>>(new Set());

  const registerAnimation = (callback: AnimationFrameCallback) => {
    callbacksRef.current.add(callback);
  };

  const unregisterAnimation = (callback: AnimationFrameCallback) => {
    callbacksRef.current.delete(callback);
  };

  useEffect(() => {
    let lastTime = performance.now();

    const frame = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;

      callbacksRef.current.forEach((callback) => callback(deltaTime));

      requestAnimationFrame(frame);
    };

    const animationFrameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <AnimationContext.Provider
      value={{ registerAnimation, unregisterAnimation }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

export { AnimationProvider, useAnimation };
