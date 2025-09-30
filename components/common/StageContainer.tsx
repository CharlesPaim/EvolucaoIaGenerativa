
import React from 'react';

interface StageContainerProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const StageContainer: React.FC<StageContainerProps> = ({ title, description, children }) => {
  return (
    <div className="bg-gray-800/30 p-6 sm:p-8 rounded-xl border border-gray-700 shadow-xl animate-fade-in">
      <h2 className="text-3xl sm:text-4xl font-bold text-cyan-300">{title}</h2>
      <p className="mt-2 mb-6 text-gray-400 max-w-3xl">{description}</p>
      <div>{children}</div>
    </div>
  );
};

// Add fade-in animation to tailwind config if possible, or define here
// Since we can't edit tailwind.config.js, we add it to index.html style block or just rely on simple class names.
// A simple animation can be done with a custom css class if needed, but for now we'll rely on React's lifecycle.
// Let's add the keyframes and animation class to the global style
const animationStyle = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #2d3748; /* gray-800 */
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #4a5568; /* gray-600 */
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #2c5282; /* blue-800 */
  }
`;

// Inject style into head
const styleSheet = document.createElement("style");
styleSheet.innerText = animationStyle;
document.head.appendChild(styleSheet);
