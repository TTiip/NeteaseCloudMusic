import { createApp } from 'vue'
import Loading from '@/components/loding/index.vue'

const useLoading = (loading: boolean, timeout = 10000): void => {
  const loadingInstance = createApp(Loading, { loading })
  const mountNode = document.createElement('div')
  loadingInstance.mount(mountNode)
  document.body.appendChild(mountNode)
  setTimeout(() => {
    loadingInstance.unmount()
    document.body.removeChild(mountNode)
  }, timeout)
}

export default useLoading
