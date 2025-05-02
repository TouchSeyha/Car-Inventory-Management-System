import { cn } from '@/lib/utils';

interface PlaceholderPatternProps {
    className?: string;
}

export default function PlaceholderPattern({ className }: PlaceholderPatternProps) {
    return (
        <svg
            className={cn('size-full', className)}
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
        >
            {/* Background pattern */}
            <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" strokeWidth="0.5" strokeOpacity="0.5" stroke="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#smallGrid)" />

            {/* Sample chart elements */}
            <g transform="translate(0,65)" className="fill-indigo-500/30 stroke-indigo-500">
                <path d="M0,35 C15,10 20,5 30,15 S45,35 60,25 S75,10 90,15 L90,35 L0,35 Z" strokeWidth="1.5" />
            </g>

            <g className="stroke-current">
                {/* X-axis */}
                <line x1="10" y1="85" x2="90" y2="85" strokeWidth="1" />
                {/* Y-axis */}
                <line x1="10" y1="15" x2="10" y2="85" strokeWidth="1" />

                {/* X-axis ticks */}
                <line x1="30" y1="83" x2="30" y2="87" strokeWidth="1" />
                <line x1="50" y1="83" x2="50" y2="87" strokeWidth="1" />
                <line x1="70" y1="83" x2="70" y2="87" strokeWidth="1" />
                <line x1="90" y1="83" x2="90" y2="87" strokeWidth="1" />

                {/* Y-axis ticks */}
                <line x1="8" y1="65" x2="12" y2="65" strokeWidth="1" />
                <line x1="8" y1="45" x2="12" y2="45" strokeWidth="1" />
                <line x1="8" y1="25" x2="12" y2="25" strokeWidth="1" />
            </g>

            {/* Data points */}
            <circle cx="30" cy="35" r="2" className="fill-indigo-500" />
            <circle cx="50" cy="55" r="2" className="fill-indigo-500" />
            <circle cx="70" cy="25" r="2" className="fill-indigo-500" />
            <circle cx="90" cy="45" r="2" className="fill-indigo-500" />

            {/* Chart label placeholders */}
            <rect x="20" y="7" width="20" height="3" rx="1" className="fill-current opacity-30" />
            <rect x="45" y="7" width="15" height="3" rx="1" className="fill-current opacity-30" />
            <rect x="65" y="7" width="25" height="3" rx="1" className="fill-current opacity-30" />
        </svg>
    );
}
