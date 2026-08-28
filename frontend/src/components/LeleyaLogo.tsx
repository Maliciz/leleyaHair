import React from 'react';

interface LeleyaLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  textClassName?: string;
  subtextClassName?: string;
}

export const LeleyaLogo: React.FC<LeleyaLogoProps> = ({
  className = 'w-10 h-10',
  size,
  showText = false,
  textClassName = 'font-serif text-2xl font-bold tracking-wider text-white',
  subtextClassName = 'block text-[10px] uppercase tracking-widest text-gold-500 font-semibold -mt-1',
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <div className="flex items-center gap-3 group">
      <div
        className={`rounded-full border border-gold-600/40 p-0.5 flex items-center justify-center bg-dark-950 group-hover:border-gold-400 transition-colors shadow-gold-sm overflow-hidden ${className}`}
        style={style}
      >
        <img
          src="./leleya_logo.svg"
          onError={(e) => {
            // Fallback to PNG if SVG fails
            (e.target as HTMLImageElement).src = './leleya_logo.png';
          }}
          alt="ЛЕЛЕЯ Logo"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      {showText && (
        <div>
          <span className={`${textClassName} group-hover:text-gold-400 transition-colors`}>
            ЛЕЛЕЯ
          </span>
          <span className={subtextClassName}>Перукарня</span>
        </div>
      )}
    </div>
  );
};

export default LeleyaLogo;
