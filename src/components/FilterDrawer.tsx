import React, { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { DateRangePicker } from './DateRangePicker';
import { PropertyFilters, FilterOptions } from '@/types/property';

interface FilterDrawerProps {
  filterOptions: FilterOptions;
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  onReset: () => void;
  resultCount: number;
}

export function FilterDrawer({ filterOptions, filters, onFiltersChange, onReset, resultCount }: FilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<PropertyFilters>(filters);

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setTempFilters({});
    onReset();
  };

  const activeFilterCount = Object.keys(tempFilters).length;

  const handleFilterChange = (filterKey: keyof PropertyFilters, value: any) => {
    setTempFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-96">
        <SheetHeader>
          <SheetTitle>Filter Properties</SheetTitle>
          <SheetDescription>
            Refine your property search with these filters
          </SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-6">
          {/* Geography Filters */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Geography</h4>
            
            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm">Country</Label>
              <Select onValueChange={(value) => handleFilterChange('country', value)}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select a country" defaultValue={filters.country} />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm">State</Label>
              <Select onValueChange={(value) => handleFilterChange('state', value)}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select a state" defaultValue={filters.state} />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.states.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* MSA */}
            <div className="space-y-2">
              <Label htmlFor="msa" className="text-sm">MSA</Label>
              <Select onValueChange={(value) => handleFilterChange('msa', value)}>
                <SelectTrigger id="msa">
                  <SelectValue placeholder="Select an MSA" defaultValue={filters.msa} />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.msas.map(msa => (
                    <SelectItem key={msa} value={msa}>{msa}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Property Filters */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Property Details</h4>
            
            {/* Property Type */}
            <div className="space-y-2">
              <Label htmlFor="propertyType" className="text-sm">Property Type</Label>
              <Select onValueChange={(value) => handleFilterChange('propertyType', value)}>
                <SelectTrigger id="propertyType">
                  <SelectValue placeholder="Select a property type" defaultValue={filters.propertyType} />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.propertyTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Class */}
            <div className="space-y-2">
              <Label htmlFor="class" className="text-sm">Class</Label>
              <Select onValueChange={(value) => handleFilterChange('class', value)}>
                <SelectTrigger id="class">
                  <SelectValue placeholder="Select a class" defaultValue={filters.class} />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.classes.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Asset Type */}
            <div className="space-y-2">
              <Label htmlFor="assetType" className="text-sm">Asset Type</Label>
              <Select onValueChange={(value) => handleFilterChange('assetType', value)}>
                <SelectTrigger id="assetType">
                  <SelectValue placeholder="Select an asset type" defaultValue={filters.assetType} />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.assetTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fund */}
            <div className="space-y-2">
              <Label htmlFor="fund" className="text-sm">Fund</Label>
              <Select onValueChange={(value) => handleFilterChange('fund', value)}>
                <SelectTrigger id="fund">
                  <SelectValue placeholder="Select a fund" defaultValue={filters.fund} />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.funds.map(fund => (
                    <SelectItem key={fund} value={fund}>{fund}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Year Built Range */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Year Built Range</h4>
            <div className="flex items-center space-x-2">
              <div>
                <Label htmlFor="yearBuiltMin" className="text-xs">Min Year</Label>
                <Input
                  type="number"
                  id="yearBuiltMin"
                  placeholder="Min Year"
                  className="w-24"
                  value={tempFilters.yearBuiltMin || ''}
                  onChange={(e) => handleFilterChange('yearBuiltMin', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="yearBuiltMax" className="text-xs">Max Year</Label>
                <Input
                  type="number"
                  id="yearBuiltMax"
                  placeholder="Max Year"
                  className="w-24"
                  value={tempFilters.yearBuiltMax || ''}
                  onChange={(e) => handleFilterChange('yearBuiltMax', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Note: Removed Date Range Picker as it's now handled by QuarterSelector */}
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters ({resultCount} results)
          </Button>
          <Button variant="outline" onClick={handleResetFilters}>
            Reset
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
