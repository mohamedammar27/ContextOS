import * as React from "react"

export interface ToastActionElement extends React.ReactElement {}

export type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  variant?: "default" | "destructive"
}

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 5000

type ToastState = {
  toasts: ToasterToast[]
}

const listeners: Array<(state: ToastState) => void> = []

let memoryState: ToastState = { toasts: [] }

function dispatch(action: { type: string; toast?: ToasterToast; toastId?: string }) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

function reducer(state: ToastState, action: { type: string; toast?: ToasterToast; toastId?: string }): ToastState {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast!, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast!.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.filter((t) => t.id !== toastId),
        }
      }
      return {
        ...state,
        toasts: [],
      }
    }

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }

  return state
}

function toast({ ...props }: Omit<ToasterToast, "id">) {
  const id = Math.random().toString(36).substring(2, 9)

  const toastData = {
    ...props,
    id,
  }

  dispatch({
    type: "ADD_TOAST",
    toast: toastData,
  })

  return {
    id,
    dismiss: () => dispatch({ type: "DISMISS_TOAST", toastId: id }),
    update: (props: Omit<ToasterToast, "id">) =>
      dispatch({
        type: "UPDATE_TOAST",
        toast: { ...props, id },
      }),
  }
}

function useToast() {
  const [state, setState] = React.useState<ToastState>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
