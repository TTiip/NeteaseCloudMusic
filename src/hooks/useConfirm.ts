import { ElMessageBox } from 'element-plus'

type typeKey= '' | 'success' | 'warning' | 'info' | 'error' | undefined

const useConfirm = (
  message: string,
  title: string,
  successCallback: () => any,
  errorCallBack?: (error: any) => any,
  type?: typeKey
): void => {
  ElMessageBox.confirm(message, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type
  })
    .then(() => {
      successCallback && successCallback()
    })
    .catch(error => {
      errorCallBack && errorCallBack(error)
    })
}

export default useConfirm
