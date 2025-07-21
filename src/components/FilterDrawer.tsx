import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { FilterOptions, PropertyFilters } from '@/types/property';
import { cn } from '@/lib/utils';

interface FilterDrawerProps {
  filterOptions: FilterOptions;
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  onReset: () => void;
  resultCount: number;
  className?: string;
}

export function FilterDrawer({
  filterOptions,
  filters,
  onFiltersChange,
  onReset,
  resultCount,
  className
}: FilterDrawerProps) {
  const activeFilterCount = Object.values(filters).filter(value => 
    value !== undefined && value !== '' && value !== null
  ).length;

  const handleFilterChange = (key: keyof PropertyFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value
    });
  };

  const removeFilter = (key: keyof PropertyFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const FilterSelect = ({ 
    label, 
    value, 
    onValueChange, 
    options, 
    placeholder 
  }: {
    label: string;
    value?: string | number;
    onValueChange: (value: string) => void;
    options: (string | number)[];
    placeholder: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Select value={value?.toString() || ''} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.toString()} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 mr-4">
          <span className="text-sm text-muted-foreground">Filters:</span>
          <div className="flex flex-wrap gap-1">
            {filters.country && (
              <Badge variant="secondary" className="text-xs">
                {filters.country}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFilter('country')}
                  className="h-3 w-3 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            {filters.state && (
              <Badge variant="secondary" className="text-xs">
                {filters.state}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFilter('state')}
                  className="h-3 w-3 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            {filters.propertyType && (
              <Badge variant="secondary" className="text-xs">
                {filters.propertyType}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFilter('propertyType')}
                  className="h-3 w-3 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            {filters.class && (
              <Badge variant="secondary" className="text-xs">
                Class {filters.class}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFilter('class')}
                  className="h-3 w-3 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-2 w-2" />
                </Button>
              </Badge>
            )}
            {activeFilterCount > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{activeFilterCount - 4} more
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Filter Button & Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-80 sm:w-96">
          <SheetHeader>
            <SheetTitle>Filter Properties</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {/* Result Count */}
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              <strong>{resultCount}</strong> properties match your criteria
            </div>

            {/* Geographic Filters */}
            <div className="space-y-4">
              <h4 className="font-medium">Geographic</h4>
              
              <FilterSelect
                label="Country"
                value={filters.country}
                onValueChange={(value) => handleFilterChange('country', value)}
                options={filterOptions.countries}
                placeholder="Select country"
              />
              
              <FilterSelect
                label="State"
                value={filters.state}
                onValueChange={(value) => handleFilterChange('state', value)}
                options={filterOptions.states}
                placeholder="Select state"
              />
              
              <FilterSelect
                label="MSA"
                value={filters.msa}
                onValueChange={(value) => handleFilterChange('msa', value)}
                options={filterOptions.msas}
                placeholder="Select MSA"
              />
            </div>

            {/* Property Filters */}
            <div className="space-y-4">
              <h4 className="font-medium">Property Details</h4>
              
              <FilterSelect
                label="Property Type"
                value={filters.propertyType}
                onValueChange={(value) => handleFilterChange('propertyType', value)}
                options={filterOptions.propertyTypes}
                placeholder="Select type"
              />
              
              <FilterSelect
                label="Class"
                value={filters.class}
                onValueChange={(value) => handleFilterChange('class', value)}
                options={filterOptions.classes}
                placeholder="Select class"
              />
              
              <FilterSelect
                label="Asset Type"
                value={filters.assetType}
                onValueChange={(value) => handleFilterChange('assetType', value)}
                options={filterOptions.assetTypes}
                placeholder="Select asset type"
              />
            </div>

            {/* Year Built Range */}
            <div className="space-y-4">
              <h4 className="font-medium">Year Built</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label className="text-sm">Min Year</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 2000"
                    value={filters.yearBuiltMin || ''}
                    onChange={(e) => handleFilterChange('yearBuiltMin', e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Max Year</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 2024"
                    value={filters.yearBuiltMax || ''}
                    onChange={(e) => handleFilterChange('yearBuiltMax', e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </div>

            {/* Fund Filters */}
            <div className="space-y-4">
              <h4 className="font-medium">Investment</h4>
              
              <FilterSelect
                label="Fund"
                value={filters.fund}
                onValueChange={(value) => handleFilterChange('fund', value)}
                options={filterOptions.funds}
                placeholder="Select fund"
              />
              
              <FilterSelect
                label="Year"
                value={filters.year}
                onValueChange={(value) => handleFilterChange('year', parseInt(value))}
                options={filterOptions.years}
                placeholder="Select year"
              />
              
              <FilterSelect
                label="Month"
                value={filters.month}
                onValueChange={(value) => handleFilterChange('month', value)}
                options={filterOptions.months}
                placeholder="Select month"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={onReset}
                className="flex-1"
              >
                Reset All
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}