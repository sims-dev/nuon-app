import logoImage from 'figma:asset/ab088da9b1407073e3bcae2b3ab51002a16a4258.png';

interface NuonLogoProps {
  variant?: 'default' | 'white';
  className?: string;
  showTagline?: boolean;
}

export function NuonLogo({ 
  variant = 'default',
  className = '',
  showTagline = false
}: NuonLogoProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src={logoImage} 
        alt="NUON - Nurses United, One Network" 
        className="w-full max-w-md"
        style={{ 
          filter: variant === 'white' ? 'brightness(0) invert(1)' : 'none' 
        }}
      />
    </div>
  );
}

// Horizontal compact version for headers
export function NuonLogoHorizontal({ 
  variant = 'default',
  className = '',
  height = 40
}: { variant?: 'default' | 'white'; className?: string; height?: number }) {
  return (
    <div className={`flex items-center ${className}`} style={{ height }}>
      <img 
        src={logoImage} 
        alt="NUON" 
        style={{ 
          height: '100%', 
          width: 'auto',
          filter: variant === 'white' ? 'brightness(0) invert(1)' : 'none'
        }}
      />
    </div>
  );
}

// Icon-only version (lamp with U)
export function NuonIcon({ 
  size = 48,
  variant = 'default'
}: { size?: number; variant?: 'default' | 'white' }) {
  return (
    <img 
      src={logoImage} 
      alt="NUON" 
      width={size}
      height={size}
      style={{ 
        objectFit: 'contain',
        filter: variant === 'white' ? 'brightness(0) invert(1)' : 'none'
      }}
    />
  );
}