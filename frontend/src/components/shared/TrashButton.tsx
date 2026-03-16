import React from 'react'
import { Button } from '../ui/button';
import { Trash } from 'lucide-react';

interface TrashArgs {
  deleteQuery: () => void  
}

const TrashButton = ({deleteQuery}: TrashArgs) => {
  return (
    <Button size="icon" variant="secondary" className='bg-transparent'
      onClick={(e) => {
        deleteQuery();
        e.stopPropagation();
      }}>
      <Trash className="w-4 h-4" />
    </Button>
  )
}

export default TrashButton
