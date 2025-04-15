import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import AdminOrderDetailsView from './orders-details'
import { Dialog } from '@radix-ui/react-dialog'

const AdminOrdersView = () => {
  const[openDetailsDialog, setOpenDetailsDialog] = useState(false)
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableCell> 21 </TableCell>
            <TableCell> 30/2/25 </TableCell>
            <TableCell> Processing </TableCell>
            <TableCell> $1000 </TableCell>
            <TableCell> 
            <Dialog
              open={openDetailsDialog}
              onOpenChange={() => {
                setOpenDetailsDialog(false);
              }}>
                <Button
                  onClick={() =>
                    setOpenDetailsDialog(true)
                  }>
                    View Details
                </Button>
              <AdminOrderDetailsView />
            </Dialog>
            </TableCell>
          </TableBody>
        </Table>
      </CardContent>
      </Card>
  )
}

export default AdminOrdersView
