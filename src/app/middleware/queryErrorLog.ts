import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit'

import toast from 'react-hot-toast'

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        toast.error(action.payload.data.message)
    }
    return next(action)
}
