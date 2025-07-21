import React from 'react';
import { Download, FileText, FileSpreadsheet, FileImage } from 'lucide-react';
import { Property, ExportOptions } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface ExportModalProps {
  properties: Property[];
  filters: any;
}

const COLUMN_OPTIONS = [
  { id: 'dealName', label: 'Deal Name', required: true },
  { id: 'source', label: 'Source' },
  { id: 'propertyType', label: 'Property Type' },
  { id: 'class', label: 'Class' },
  { id: 'propertySubType', label: 'Property Sub Type' },
  { id: 'vintage', label: 'Vintage' },
  { id: 'avgUnitSize', label: 'Avg Unit Size' },
  { id: 'occupancyPrevQ', label: 'Occupancy Prev Q' },
  { id: 'occupancyInPlace', label: 'Occupancy In-Place' },
  { id: 'occupancyStabilized', label: 'Occupancy Stabilized' },
  { id: 'rent', label: 'Rent' },
  { id: 'egi', label: 'EGI' },
  { id: 'reTax', label: 'RE Tax' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'otherOpEx', label: 'Other OpEx' },
  { id: 'totalOpEx', label: 'Total OpEx' },
  { id: 'noi', label: 'NOI / NCF' },
  { id: 'msa', label: 'MSA' },
  { id: 'state', label: 'State' },
  { id: 'fund', label: 'Fund' },
  { id: 'assetType', label: 'Asset Type' }
];

export function ExportModal({ properties, filters }: ExportModalProps) {
  const [format, setFormat] = React.useState<'csv' | 'excel' | 'pdf'>('csv');
  const [selectedColumns, setSelectedColumns] = React.useState<string[]>(
    COLUMN_OPTIONS.filter(col => col.required).map(col => col.id)
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const { toast } = useToast();

  const handleColumnToggle = (columnId: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns(prev => [...prev, columnId]);
    } else {
      const column = COLUMN_OPTIONS.find(col => col.id === columnId);
      if (column?.required) return; // Can't uncheck required columns
      setSelectedColumns(prev => prev.filter(id => id !== columnId));
    }
  };

  const handleExport = () => {
    const exportOptions: ExportOptions = {
      format,
      columns: selectedColumns,
      properties,
      filters
    };

    // Simulate export process
    toast({
      title: "Export Started",
      description: `Generating ${format.toUpperCase()} report with ${properties.length} properties...`,
    });

    // In a real app, this would call the backend API
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Your ${format.toUpperCase()} report has been downloaded successfully.`,
      });
      setIsOpen(false);
    }, 2000);

    console.log('Export Options:', exportOptions);
  };

  const getFormatIcon = (formatType: string) => {
    switch (formatType) {
      case 'csv': return <FileText className="h-4 w-4" />;
      case 'excel': return <FileSpreadsheet className="h-4 w-4" />;
      case 'pdf': return <FileImage className="h-4 w-4" />;
      default: return <Download className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Property Report</DialogTitle>
          <DialogDescription>
            Generate a comprehensive report of your selected properties with customizable columns and format options.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Export Summary */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Export Summary</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Properties: <strong>{properties.length}</strong></div>
              <div>Columns: <strong>{selectedColumns.length}</strong></div>
              {Object.keys(filters).length > 0 && (
                <div>Filters Applied: <strong>{Object.keys(filters).length}</strong></div>
              )}
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Export Format</Label>
            <RadioGroup value={format} onValueChange={(value) => setFormat(value as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="h-4 w-4" />
                  CSV - Comma Separated Values
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="flex items-center gap-2 cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel - Spreadsheet Format
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer">
                  <FileImage className="h-4 w-4" />
                  PDF - Formatted Report
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Column Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Select Columns</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedColumns(COLUMN_OPTIONS.map(col => col.id))}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedColumns(COLUMN_OPTIONS.filter(col => col.required).map(col => col.id))}
                >
                  Required Only
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto border rounded-lg p-4">
              {COLUMN_OPTIONS.map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={column.id}
                    checked={selectedColumns.includes(column.id)}
                    onCheckedChange={(checked) => handleColumnToggle(column.id, !!checked)}
                    disabled={column.required}
                  />
                  <Label 
                    htmlFor={column.id} 
                    className={`text-sm cursor-pointer ${column.required ? 'font-medium' : ''}`}
                  >
                    {column.label}
                    {column.required && <span className="text-muted-foreground ml-1">(required)</span>}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} className="gap-2">
              {getFormatIcon(format)}
              Export {format.toUpperCase()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}