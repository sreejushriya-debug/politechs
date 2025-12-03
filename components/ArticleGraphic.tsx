"use client";

interface ArticleGraphicProps {
  colors: [string, string];
  icon: string;
  title: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ArticleGraphic({ 
  colors, 
  icon, 
  title,
  size = "md",
  className = "" 
}: ArticleGraphicProps) {
  const sizeClasses = {
    sm: "h-32",
    md: "h-48",
    lg: "h-64"
  };

  const iconSizes = {
    sm: "text-3xl",
    md: "text-5xl",
    lg: "text-7xl"
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-xl ${sizeClasses[size]} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${colors[0]}20, ${colors[1]}20)`
      }}
    >
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        }}
      />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(${colors[0]}40 1px, transparent 1px),
            linear-gradient(90deg, ${colors[0]}40 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Floating shapes */}
      <div 
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl animate-float"
        style={{ background: colors[0], opacity: 0.3 }}
      />
      <div 
        className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full blur-2xl animate-float delay-300"
        style={{ background: colors[1], opacity: 0.3 }}
      />
      
      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className={`${iconSizes[size]} filter drop-shadow-lg`}
          style={{
            textShadow: `0 0 30px ${colors[0]}80`
          }}
        >
          {icon}
        </span>
      </div>
      
      {/* Subtle shine effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent"
      />
    </div>
  );
}

