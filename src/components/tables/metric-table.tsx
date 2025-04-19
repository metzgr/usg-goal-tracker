import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    TableCaption,
  } from "@/components/base/table";

export function MetricTable({ metrics }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Org</TableHead>

                    <TableHead className="">Indicator</TableHead>
        
                    <TableHead>Target</TableHead>
                    <TableHead>Objective</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {metrics.map((m) => (
                    <TableRow key={m.id}>

<TableCell>{m.orgAcronym}</TableCell>
<TableCell>{m.name}</TableCell>

<TableCell>{m.mostRecentTargetDirection} {m.mostRecentTargetResult}</TableCell>
                     
                        <TableCell>{m.objectiveName}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}