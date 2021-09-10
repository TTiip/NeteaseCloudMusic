import { ElMessage } from 'element-plus'

type typeKey= '' | 'success' | 'warning' | 'info' | 'error' | undefined

const useMessage = (type: typeKey, message: string, showClose = false): void => {
  ElMessage({
    showClose,
    message,
    type
  })
}

export default useMessage
