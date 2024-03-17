import React from 'react'
import { useToast } from './use_toast'
import { IconCircleCheck } from '@tabler/icons-react'

export default function useSuccessToast() {
  const { toast } = useToast()

  return function (message: string = "Saved successfully") {
    toast({
      title: (
        <div className="flex items-center space-x-2">
          <IconCircleCheck className="text-blue-600 h-5 w-5" />
          <p>{message}</p>
        </div>
      ),
    })
  }
}
