import React, { useState, useMemo } from 'react';
import { Building2, BarChart3 } from 'lucide-react';
import { Property, PropertyFilters } from '@/types/property';
import { mockProperties, mockFilterOptions } from '@/data/mockProperties';
import { PropertySearch } from './PropertySearch';
import { FilterDrawer } from './FilterDrawer';
import { PropertyTable } from './PropertyTable';
import { QuarterSelector } from './QuarterSelector';
import { ComparisonCharts } from './ComparisonCharts';
import { cn } from '@/lib/utils';

export function Dashboard() {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [selectedPeriod, setSelectedPeriod] = useState<{
    type: 'quarter' | 'date' | 'month';
    value: string;
  }>();

  // Filter properties based on current filters
  const filteredProperties = useMemo(() => {
    return mockProperties.filter(property => {
      if (filters.country && property.country !== filters.country) return false;
      if (filters.state && property.state !== filters.state) return false;
      if (filters.msa && property.msa !== filters.msa) return false;
      if (filters.propertyType && property.propertyType !== filters.propertyType) return false;
      if (filters.class && property.class !== filters.class) return false;
      if (filters.assetType && property.assetType !== filters.assetType) return false;
      if (filters.fund && property.fund !== filters.fund) return false;
      if (filters.yearBuiltMin && property.yearBuilt < filters.yearBuiltMin) return false;
      if (filters.yearBuiltMax && property.yearBuilt > filters.yearBuiltMax) return false;
      
      return true;
    });
  }, [filters]);

  const handlePropertySelect = (property: Property) => {
    if (selectedProperties.length >= 5) return; // Max 5 properties
    setSelectedProperties(prev => [...prev, property]);
  };

  const handlePropertyRemove = (propertyId: string) => {
    setSelectedProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const handleFiltersReset = () => {
    setFilters({});
  };

  const handleRefresh = async () => {
    // Simulate refresh action - in real app, this would refetch data
    console.log('Refreshing property data...');
    // You can add actual refresh logic here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="dashboard-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Property Analytics</h1>
              <p className="text-sm text-muted-foreground">
                Compare and analyze real estate investment properties
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {mockProperties.length} properties available
            </span>
          </div>
        </div>
      </header>

      {/* Quarter/Time Period Selector */}
      <QuarterSelector
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      {/* Main Content */}
      <div className="dashboard-content">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Search & Filters Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Property Comparison</h2>
              <FilterDrawer
                filterOptions={mockFilterOptions}
                filters={filters}
                onFiltersChange={setFilters}
                onReset={handleFiltersReset}
                resultCount={filteredProperties.length}
              />
            </div>
            
            <PropertySearch
              properties={filteredProperties}
              selectedProperties={selectedProperties}
              onPropertySelect={handlePropertySelect}
              onPropertyRemove={handlePropertyRemove}
              onRefresh={handleRefresh}
            />
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            {selectedProperties.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="p-4 bg-muted/30 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Start Your Analysis</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Use the search above to find and select properties for side-by-side comparison. 
                    You can compare up to 5 properties at once.
                  </p>
                </div>
                <div className="text-sm text-muted-foreground mt-4">
                  💡 Try searching for property names like "Meridian" or "Oakwood"
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Comparison Charts */}
                {selectedProperties.length >= 2 && (
                  <ComparisonCharts properties={selectedProperties} />
                )}
                
                {/* Property Table */}
                <PropertyTable 
                  properties={selectedProperties} 
                  filters={filters}
                  selectedPeriod={selectedPeriod}
                />
              </div>
            )}
          </div>

          {/* Quick Stats */}
          {filteredProperties.length !== mockProperties.length && (
            <div className="mt-8 p-4 bg-muted/30 rounded-lg">
              <div className="text-sm text-muted-foreground">
                <strong>Filter Results:</strong> Showing {filteredProperties.length} of {mockProperties.length} properties
                {Object.keys(filters).length > 0 && (
                  <span className="ml-2">
                    • {Object.keys(filters).length} filter{Object.keys(filters).length !== 1 ? 's' : ''} applied
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
