
import React, { useState, useMemo } from 'react';
import { Search, X, RefreshCw } from 'lucide-react';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PropertySearchProps {
  properties: Property[];
  selectedProperties: Property[];
  onPropertySelect: (property: Property) => void;
  onPropertyRemove: (propertyId: string) => void;
  onRefresh?: () => void;
  className?: string;
}

export function PropertySearch({
  properties,
  selectedProperties,
  onPropertySelect,
  onPropertyRemove,
  onRefresh,
  className
}: PropertySearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredProperties = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const selectedIds = new Set(selectedProperties.map(p => p.id));
    
    return properties
      .filter(property => 
        !selectedIds.has(property.id) &&
        property.dealName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 8); // Limit to 8 results for performance
  }, [searchTerm, properties, selectedProperties]);

  const handlePropertySelect = (property: Property) => {
    onPropertySelect(property);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(value.trim().length > 0);
  };

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      await onRefresh();
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Selected Properties */}
      {selectedProperties.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProperties.map((property) => (
            <Badge
              key={property.id}
              variant="secondary"
              className="text-sm py-1 px-3 gap-2"
            >
              {property.dealName}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPropertyRemove(property.id)}
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search properties to compare..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => searchTerm.trim() && setIsDropdownOpen(true)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
            className="pl-10 pr-12"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
        </div>

        {/* Search Results Dropdown */}
        {isDropdownOpen && filteredProperties.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
            {filteredProperties.map((property) => (
              <button
                key={property.id}
                onClick={() => handlePropertySelect(property)}
                className="w-full text-left px-4 py-3 hover:bg-accent hover:text-accent-foreground border-b border-border last:border-b-0 transition-colors"
              >
                <div className="font-medium">{property.dealName}</div>
                <div className="text-sm text-muted-foreground">
                  {property.propertyType} • {property.class} Class • {property.msa}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {isDropdownOpen && searchTerm.trim() && filteredProperties.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 p-4 text-center text-muted-foreground">
            No properties found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Comparison Limit Warning */}
      {selectedProperties.length >= 5 && (
        <div className="text-sm text-warning bg-warning/10 border border-warning/20 rounded-md p-3">
          Maximum of 5 properties can be compared at once. Remove a property to add another.
        </div>
      )}
    </div>
  );
}
