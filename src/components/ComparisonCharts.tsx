
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from '@/types/property';

interface ComparisonChartsProps {
  properties: Property[];
}

export function ComparisonCharts({ properties }: ComparisonChartsProps) {
  if (properties.length < 2) {
    return null;
  }

  // Prepare data for charts
  const occupancyData = properties.map(property => ({
    name: property.dealName,
    occupancyInPlace: property.occupancyInPlace,
    occupancyStabilized: property.occupancyStabilized,
    occupancyPrevQ: property.occupancyPrevQ,
  }));

  const financialData = properties.map(property => ({
    name: property.dealName,
    rent: property.rent,
    noi: property.noi / 1000000, // Convert to millions
    egi: property.egi / 1000000, // Convert to millions
  }));

  const chartConfig = {
    occupancyInPlace: {
      label: "Current Occupancy",
      color: "hsl(var(--chart-1))",
    },
    occupancyStabilized: {
      label: "Stabilized Occupancy",
      color: "hsl(var(--chart-2))",
    },
    occupancyPrevQ: {
      label: "Previous Quarter",
      color: "hsl(var(--chart-3))",
    },
    rent: {
      label: "Rent",
      color: "hsl(var(--chart-1))",
    },
    noi: {
      label: "NOI (M)",
      color: "hsl(var(--chart-2))",
    },
    egi: {
      label: "EGI (M)",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Occupancy Comparison Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    domain={[0, 100]}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar 
                    dataKey="occupancyInPlace" 
                    fill="var(--color-occupancyInPlace)"
                    name="Current Occupancy"
                  />
                  <Bar 
                    dataKey="occupancyStabilized" 
                    fill="var(--color-occupancyStabilized)"
                    name="Stabilized Occupancy"
                  />
                  <Bar 
                    dataKey="occupancyPrevQ" 
                    fill="var(--color-occupancyPrevQ)"
                    name="Previous Quarter"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Financial Metrics Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Metrics Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    yAxisId="left"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    yAxisId="right"
                    orientation="right"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar 
                    dataKey="rent" 
                    fill="var(--color-rent)"
                    name="Rent"
                    yAxisId="right"
                  />
                  <Bar 
                    dataKey="noi" 
                    fill="var(--color-noi)"
                    name="NOI (M)"
                    yAxisId="left"
                  />
                  <Bar 
                    dataKey="egi" 
                    fill="var(--color-egi)"
                    name="EGI (M)"
                    yAxisId="left"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
