import React from 'react';
import { Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  dateFrom?: Date;
  dateTo?: Date;
  onDateChange: (dateFrom?: Date, dateTo?: Date) => void;
  className?: string;
}

export function DateRangePicker({ dateFrom, dateTo, onDateChange, className }: DateRangePickerProps) {
  const [isFromOpen, setIsFromOpen] = React.useState(false);
  const [isToOpen, setIsToOpen] = React.useState(false);

  const handleFromDateSelect = (date: Date | undefined) => {
    onDateChange(date, dateTo);
    setIsFromOpen(false);
  };

  const handleToDateSelect = (date: Date | undefined) => {
    onDateChange(dateFrom, date);
    setIsToOpen(false);
  };

  const clearDateRange = () => {
    onDateChange(undefined, undefined);
  };

  const hasDateRange = dateFrom || dateTo;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Date Range</Label>
        {hasDateRange && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDateRange}
            className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {/* From Date */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">From</Label>
          <Popover open={isFromOpen} onOpenChange={setIsFromOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "Start date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dateFrom}
                onSelect={handleFromDateSelect}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* To Date */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">To</Label>
          <Popover open={isToOpen} onOpenChange={setIsToOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateTo && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "MMM dd, yyyy") : "End date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={dateTo}
                onSelect={handleToDateSelect}
                initialFocus
                disabled={(date) => dateFrom ? date < dateFrom : false}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Quick Range Buttons */}
      <div className="grid grid-cols-3 gap-1">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => {
            const today = new Date();
            const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            onDateChange(thirtyDaysAgo, today);
          }}
        >
          30 Days
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => {
            const today = new Date();
            const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
            onDateChange(ninetyDaysAgo, today);
          }}
        >
          90 Days
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => {
            const today = new Date();
            const oneYearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
            onDateChange(oneYearAgo, today);
          }}
        >
          1 Year
        </Button>
      </div>

      {/* Selected Range Display */}
      {hasDateRange && (
        <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded">
          Range: {dateFrom ? format(dateFrom, "MMM dd, yyyy") : "Start"} → {dateTo ? format(dateTo, "MMM dd, yyyy") : "End"}
        </div>
      )}
    </div>
  );
}