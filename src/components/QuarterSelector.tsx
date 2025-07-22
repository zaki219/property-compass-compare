
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface QuarterSelectorProps {
  selectedPeriod?: {
    type: 'quarter' | 'date' | 'month';
    value: string;
  };
  onPeriodChange: (period: { type: 'quarter' | 'date' | 'month'; value: string }) => void;
}

export function QuarterSelector({ selectedPeriod, onPeriodChange }: QuarterSelectorProps) {
  const [isDateOpen, setIsDateOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<Date>();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleQuarterSelect = (quarter: string, year: string) => {
    onPeriodChange({ type: 'quarter', value: `${quarter} ${year}` });
  };

  const handleMonthSelect = (month: string, year: string) => {
    onPeriodChange({ type: 'month', value: `${month} ${year}` });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setTempDate(date);
      onPeriodChange({ type: 'date', value: format(date, 'yyyy-MM-dd') });
      setIsDateOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-card border-b">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Time Period:</span>
      </div>

      {/* Quarter Selection */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Quarter:</span>
        <Select onValueChange={(value) => {
          const [quarter, year] = value.split('-');
          handleQuarterSelect(quarter, year);
        }}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Quarter" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => 
              quarters.map(quarter => (
                <SelectItem key={`${quarter}-${year}`} value={`${quarter}-${year}`}>
                  {quarter} {year}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Month/Year Selection */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Month:</span>
        <Select onValueChange={(value) => {
          const [month, year] = value.split('-');
          handleMonthSelect(month, year);
        }}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Month Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => 
              months.map(month => (
                <SelectItem key={`${month}-${year}`} value={`${month}-${year}`}>
                  {month} {year}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Specific Date Selection */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Date:</span>
        <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-36 justify-start text-left font-normal",
                !tempDate && "text-muted-foreground"
              )}
            >
              <Calendar className="mr-2 h-4 w-4" />
              {tempDate ? format(tempDate, "MMM dd, yyyy") : "Pick date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={tempDate}
              onSelect={handleDateSelect}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Current Selection Display */}
      {selectedPeriod && (
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">Selected:</span>
          <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
            {selectedPeriod.value}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPeriodChange({ type: 'quarter', value: '' })}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      )}
    </div>
  );
}
