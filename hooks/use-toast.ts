// lib/toast.ts
"use client"

import * as React from "react"

export type ToastActionElement = React.ReactNode

export interface ToastProps {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 4000

type ToasterToast = ToastProps & { id: string }

let count = 0
const genId = () => (++count).toString()

type State = { toasts: ToasterToast[] }

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()
const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((l) => l(memoryState))
}

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) return
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({ type: "REMOVE_TOAST", toastId })
  }, TOAST_REMOVE_DELAY)
  toastTimeouts.set(toastId, timeout)
}

type Action =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TOAST":
      return { toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) }
    case "UPDATE_TOAST":
      return {
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }
    case "DISMISS_TOAST":
      action.toastId
        ? addToRemoveQueue(action.toastId)
        : state.toasts.forEach((t) => addToRemoveQueue(t.id))
      return {
        toasts: state.toasts.map((t) =>
          action.toastId === undefined || t.id === action.toastId
            ? { ...t, open: false }
            : t
        ),
      }
    case "REMOVE_TOAST":
      return {
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

export function toast(props: ToastProps) {
  const id = genId()
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })
  const update = (toast: ToastProps) =>
    dispatch({ type: "UPDATE_TOAST", toast: { ...toast, id } })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => !open && dismiss(),
    },
  })

  return { id, dismiss, update }
}

export function useToast(p0: { title: string; description: any; variant: string }) {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return {
    toasts: state.toasts,
    toast,
    dismiss: (id?: string) => dispatch({ type: "DISMISS_TOAST", toastId: id }),
  }
}
