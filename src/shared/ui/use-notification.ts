import { useToast as usePrimeToast } from 'primevue/usetoast'

export function useNotification() {
    const toast = usePrimeToast()

    return {
        success: (summary: string, detail: string, life = 3000) => {
            toast.add({ severity: 'success', summary, detail, life })
        },
        error: (summary: string, detail: string, life = 3000) => {
            toast.add({ severity: 'error', summary, detail, life })
        },
        info: (summary: string, detail: string, life = 3000) => {
            toast.add({ severity: 'info', summary, detail, life })
        }
    }
}