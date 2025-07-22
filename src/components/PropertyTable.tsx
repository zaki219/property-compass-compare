import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowDown, ArrowUp, Download, Filter, MoreHorizontal } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { DateRangePicker } from './DateRangePicker';
import { useForm } from 'react-hook-form';
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Property, PropertyFilters } from '@/types/property';

interface PropertyTableProps {
  properties: Property[];
  filters: PropertyFilters;
  selectedPeriod?: {
    type: 'quarter' | 'date' | 'month';
    value: string;
  };
}

const filterSchema = z.object({
  format: z.enum(['csv', 'excel', 'pdf']).default('csv'),
  columns: z.string().array().optional(),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
});

export function PropertyTable({ properties, filters, selectedPeriod }: PropertyTableProps) {
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const form = useForm<z.infer<typeof filterSchema>>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      format: 'csv',
      columns: [],
    },
  });

  const columns: ColumnDef<Property>[] = [
    {
      accessorKey: 'dealName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Deal Name
            <ArrowUp className="h-4 w-4" />
            <ArrowDown className="h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: 'propertyType',
      header: "Property Type",
    },
    {
      accessorKey: 'class',
      header: "Class",
    },
    {
      accessorKey: 'state',
      header: "State",
    },
    {
      accessorKey: 'msa',
      header: "MSA",
    },
    {
      accessorKey: 'occupancyInPlace',
      header: "Occupancy",
      cell: ({ row }) => {
        const occupancy = row.getValue('occupancyInPlace') as number;
        const formatted = occupancy.toFixed(1) + '%';
        return formatted;
      }
    },
    {
      accessorKey: 'rent',
      header: "Rent",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const property = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(property.id)}
              >
                Copy property ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Stats</DropdownMenuItem>
              <DropdownMenuItem>Hide</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: properties,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection,
    },
  })

  const onSubmit = (data: z.infer<typeof filterSchema>) => {
    console.log(data);
  }

  return (
    <div className="space-y-4">
      {/* Header with period display and export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">
            Property Comparison ({properties.length})
          </h3>
          {selectedPeriod && selectedPeriod.value && (
            <div className="text-sm text-muted-foreground">
              Period: <span className="font-medium">{selectedPeriod.value}</span>
            </div>
          )}
        </div>
        <Sheet open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Export Options</SheetTitle>
              <SheetDescription>
                Customize your export settings here.
              </SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="format"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Format</FormLabel>
                      <FormControl>
                        <select {...field} className="border rounded px-2 py-1">
                          <option value="csv">CSV</option>
                          <option value="excel">Excel</option>
                          <option value="pdf">PDF</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="columns"
                  render={() => (
                    <FormItem>
                      <FormLabel>Columns</FormLabel>
                      <div className="flex flex-col space-y-2">
                        {columns.map((column) => (
                          <div key={column.accessorKey} className="flex items-center space-x-2">
                            <Input
                              type="checkbox"
                              id={column.accessorKey as string}
                            // checked={field.value?.includes(column.accessorKey as string)}
                            // onChange={(e) => {
                            //   if (e.target.checked) {
                            //     field.onChange([...(field.value || []), column.accessorKey as string])
                            //   } else {
                            //     field.onChange(field.value?.filter((value) => value !== column.accessorKey)
                            //     )
                            //   }
                            // }}
                            />
                            <Label htmlFor={column.accessorKey as string}>{column.header}</Label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of {table.getCoreRowModel().rows.length} row(s)
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
