import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { Property, PropertyFilters } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ExportModal } from './ExportModal';
import { cn } from '@/lib/utils';

interface PropertyTableProps {
  properties: Property[];
  filters?: PropertyFilters;
  className?: string;
}

type SortField = keyof Property;
type SortDirection = 'asc' | 'desc' | null;

export function PropertyTable({ properties, filters = {}, className }: PropertyTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 0): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return `${formatNumber(value, 1)}%`;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProperties = React.useMemo(() => {
    if (!sortField || !sortDirection) return properties;

    return [...properties].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [properties, sortField, sortDirection]);

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-medium justify-start hover:bg-transparent"
    >
      {children}
      {sortField === field ? (
        sortDirection === 'asc' ? (
          <ArrowUp className="ml-1 h-3 w-3" />
        ) : (
          <ArrowDown className="ml-1 h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
      )}
    </Button>
  );

  const getClassBadgeVariant = (classType: string) => {
    switch (classType) {
      case 'A': return 'default';
      case 'B': return 'secondary';
      case 'C': return 'outline';
      default: return 'secondary';
    }
  };

  if (properties.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
        <div className="text-muted-foreground mb-4">
          <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <h3 className="text-lg font-medium">No Properties Selected</h3>
          <p className="text-sm">Search and select properties above to compare their metrics side-by-side.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Comparing {properties.length} {properties.length === 1 ? 'property' : 'properties'}
        </div>
        <ExportModal properties={properties} filters={filters} />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="sticky left-0 bg-muted/50 border-r min-w-[200px]">
                  <SortButton field="dealName">Deal Name</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="source">Source</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="propertyType">Property Type</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="class">Class</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="propertySubType">Sub Type</SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="vintage">Vintage</SortButton>
                </TableHead>
                <TableHead className="text-right">
                  <SortButton field="avgUnitSize">Avg Unit Size</SortButton>
                </TableHead>
                <TableHead className="text-right">
                  <SortButton field="occupancyPrevQ">Occupancy Prev Q</SortButton>
                </TableHead>
                <TableHead className="text-right">
                  <SortButton field="occupancyInPlace">Occupancy In-Place</SortButton>
                </TableHead>
                <TableHead className="text-right">
                  <SortButton field="occupancyStabilized">Occupancy Stabilized</SortButton>
                </TableHead>
                <TableHead className="text-right">
                  <SortButton field="rent">Rent</SortButton>
                </TableHead>
                <TableHead className="text-right">
                  <SortButton field="egi">EGI</SortButton>
                </TableHead>
                <TableHead className="text-right">
                  <SortButton field="reTax">RE Tax</SortButton>
                </TableHead>
                <TableHead className="text-right">
                  <SortButton field="insurance">Insurance</SortButton>
                </TableHead>
                <TableHead className="text-right">
                  <SortButton field="otherOpEx">Other OpEx</SortButton>
                </TableHead>
                <TableHead className="text-right">
                  <SortButton field="totalOpEx">Total OpEx</SortButton>
                </TableHead>
                <TableHead className="text-right">
                  <SortButton field="noi">NOI / NCF</SortButton>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedProperties.map((property) => (
                <TableRow key={property.id} className="hover:bg-muted/30">
                  <TableCell className="sticky left-0 bg-background border-r font-medium">
                    <div>
                      <div className="font-medium">{property.dealName}</div>
                      <div className="text-xs text-muted-foreground">
                        {property.msa}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {property.source}
                    </Badge>
                  </TableCell>
                  <TableCell>{property.propertyType}</TableCell>
                  <TableCell>
                    <Badge variant={getClassBadgeVariant(property.class)} className="text-xs">
                      {property.class}
                    </Badge>
                  </TableCell>
                  <TableCell>{property.propertySubType}</TableCell>
                  <TableCell>{property.vintage}</TableCell>
                  <TableCell className="financial-metric">
                    {formatNumber(property.avgUnitSize).toLocaleString()}
                  </TableCell>
                  <TableCell className="financial-metric">
                    {formatPercentage(property.occupancyPrevQ)}
                  </TableCell>
                  <TableCell className="financial-metric">
                    {formatPercentage(property.occupancyInPlace)}
                  </TableCell>
                  <TableCell className="financial-metric">
                    {formatPercentage(property.occupancyStabilized)}
                  </TableCell>
                  <TableCell className="financial-metric">
                    {property.propertyType === 'Office' || property.propertyType === 'Retail' || property.propertyType === 'Industrial' 
                      ? `$${formatNumber(property.rent, 2)}/SF` 
                      : formatCurrency(property.rent)}
                  </TableCell>
                  <TableCell className="financial-metric">
                    {formatCurrency(property.egi)}
                  </TableCell>
                  <TableCell className="financial-metric">
                    {formatCurrency(property.reTax)}
                  </TableCell>
                  <TableCell className="financial-metric">
                    {formatCurrency(property.insurance)}
                  </TableCell>
                  <TableCell className="financial-metric">
                    {formatCurrency(property.otherOpEx)}
                  </TableCell>
                  <TableCell className="financial-metric">
                    {formatCurrency(property.totalOpEx)}
                  </TableCell>
                  <TableCell className="financial-metric font-semibold">
                    {formatCurrency(property.noi)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}