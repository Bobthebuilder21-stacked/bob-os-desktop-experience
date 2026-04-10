import { Battery, BatteryCharging, Wifi, Volume2 } from "lucide-react";

interface StatusIndicatorsProps {
  battery: number;
  formattedTime: string;
  formattedDate?: string;
  showExtras?: boolean;
}

export function StatusIndicators({ battery, formattedTime, formattedDate, showExtras = false }: StatusIndicatorsProps) {
  const BatteryIcon = battery > 90 ? BatteryCharging : Battery;

  return (
    <div className="flex items-center gap-3 text-sm">
      {showExtras && (
        <>
          <Wifi className="w-4 h-4 text-foreground/70" />
          <Volume2 className="w-4 h-4 text-foreground/70" />
        </>
      )}
      <div className="flex items-center gap-1 text-foreground/70">
        <BatteryIcon className="w-4 h-4" />
        <span>{battery}%</span>
      </div>
      <div className="text-foreground/80 font-medium">
        {formattedDate && <span className="mr-2">{formattedDate}</span>}
        {formattedTime}
      </div>
    </div>
  );
}
