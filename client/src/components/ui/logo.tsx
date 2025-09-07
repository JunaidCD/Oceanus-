import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl", 
    xl: "text-3xl"
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Ocean waves background */}
          <defs>
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary-foreground))" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          {/* Main circular background */}
          <circle cx="24" cy="24" r="22" fill="url(#oceanGradient)" stroke="hsl(var(--primary-foreground))" strokeWidth="1" strokeOpacity="0.2" />
          
          {/* Ocean waves - layered for depth */}
          <path
            d="M6 28 Q12 24, 18 28 T30 28 T42 28 V40 Q36 36, 30 40 T18 40 T6 40 Z"
            fill="url(#waveGradient)"
          />
          <path
            d="M4 32 Q10 28, 16 32 T28 32 T40 32 V42 Q34 38, 28 42 T16 42 T4 42 Z"
            fill="hsl(var(--primary-foreground))"
            fillOpacity="0.15"
          />
          
          {/* DNA/Molecular helix structure representing biodiversity */}
          <g transform="translate(20, 8)">
            {/* DNA backbone */}
            <path
              d="M2 4 Q4 8, 2 12 Q0 16, 2 20 Q4 24, 2 28"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth="1.5"
              fill="none"
              strokeOpacity="0.6"
            />
            <path
              d="M6 4 Q4 8, 6 12 Q8 16, 6 20 Q4 24, 6 28"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth="1.5"
              fill="none"
              strokeOpacity="0.6"
            />
            
            {/* DNA base pairs */}
            <line x1="2" y1="6" x2="6" y2="6" stroke="hsl(var(--primary-foreground))" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="2" y1="10" x2="6" y2="10" stroke="hsl(var(--primary-foreground))" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="2" y1="14" x2="6" y2="14" stroke="hsl(var(--primary-foreground))" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="2" y1="18" x2="6" y2="18" stroke="hsl(var(--primary-foreground))" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="2" y1="22" x2="6" y2="22" stroke="hsl(var(--primary-foreground))" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="2" y1="26" x2="6" y2="26" stroke="hsl(var(--primary-foreground))" strokeWidth="1" strokeOpacity="0.4" />
          </g>
          
          {/* Data nodes representing AI/digital aspect */}
          <circle cx="14" cy="16" r="2" fill="hsl(var(--primary-foreground))" fillOpacity="0.6" />
          <circle cx="34" cy="18" r="1.5" fill="hsl(var(--primary-foreground))" fillOpacity="0.5" />
          <circle cx="32" cy="12" r="1" fill="hsl(var(--primary-foreground))" fillOpacity="0.4" />
          
          {/* Connecting lines between data nodes */}
          <line x1="14" y1="16" x2="32" y2="12" stroke="hsl(var(--primary-foreground))" strokeWidth="0.8" strokeOpacity="0.3" />
          <line x1="32" y1="12" x2="34" y2="18" stroke="hsl(var(--primary-foreground))" strokeWidth="0.8" strokeOpacity="0.3" />
          
          {/* Central "O" letter with modern styling */}
          <circle cx="24" cy="24" r="8" fill="none" stroke="hsl(var(--primary-foreground))" strokeWidth="2.5" strokeOpacity="0.9" />
          <circle cx="24" cy="24" r="5" fill="hsl(var(--primary-foreground))" fillOpacity="0.15" />
        </svg>
      </div>
      
      {showText && (
        <div>
          <h1 className={cn("font-bold text-primary leading-tight", textSizeClasses[size])}>
            Oceanus
          </h1>
          <p className="text-xs text-muted-foreground leading-tight">
            Marine Data Platform
          </p>
        </div>
      )}
    </div>
  );
}