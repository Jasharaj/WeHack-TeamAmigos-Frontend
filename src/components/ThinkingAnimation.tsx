'use client';

export default function ThinkingAnimation() {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-black">Thinking</span>
      <div className="flex space-x-1">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className="w-2 h-2 bg-green-600 rounded-full animate-bounce"
            style={{ 
              animationDelay: `${dot * 0.2}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
    </div>
  );
}
