'use client'
// Define the pulse animation
const pulseAnimation = `@keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
    }
  }`;

export default function Pulse() {
    return (
        <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-blue-600 relative"
                style={{ animation: "pulse 2s infinite", boxShadow: "0 0 0 0 rgba(37, 99, 235, 0.7)" }} />
            <PulseAnimation />
        </div>
    )
}

function PulseAnimation() {
    return (
        <style jsx>{pulseAnimation}</style>
    )
}