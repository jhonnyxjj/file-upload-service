interface CircularProgressBarProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    circleColor?: string;
    progressColor?: string;
}

export function CircularProgressBar({
    progress,
    size = 120,
    strokeWidth = 8,
    circleColor = "text-zinc-800",
    progressColor = "text-green-500",
}: CircularProgressBarProps) {
    const clampedProgress = Math.min(100, Math.max(0, progress))

    const center = size / 2
    const radius = center - strokeWidth / 2
    const circumference = 2 * Math.PI * radius
    const strokeOffset =
        circumference - (clampedProgress / 100) * circumference

    return (
        <div
            className="relative inline-flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            <svg
                className="w-full h-full -rotate-90"
                viewBox={`0 0 ${size} ${size}`}
            >
                {/* Background circle */}
                <circle
                    className={`${circleColor} stroke-current`}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={center}
                    cy={center}
                />

                {/* Progress circle */}
                <circle
                    className={`${progressColor} stroke-current transition-[stroke-dashoffset] duration-500 ease-in-out`}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={center}
                    cy={center}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                />
            </svg>

            <span className="absolute text-xs font-medium text-zinc-50">
                {clampedProgress}
                <span className="ml-0.5 text-xxs text-zinc-400">%</span>
            </span>
        </div>
    )
}
