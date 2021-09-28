# 基于网易云音乐API实现PC端音乐网站

#### 介绍
>采用VUE及网易云音乐 Node.js API service实现，网站风格参考了各平台(嘘，其实就是究极缝合怪=。=)，感谢[网易云音乐 NodeJS 版 API](https://binaryify.github.io/NeteaseCloudMusicApi/#/)！
:joy:  感觉写的很乱，功能虽已实现，但是代码还亟待优化，码农不易，欢迎 **star~** ,hhhh~


#### 安装教程
>1、clone下vue代码后，安装依赖 npm install ，运行服务npm run serve

>2、clone下上面网易云音乐NodeJs代码后，安装依赖 npm install ，运行服务npm run start

#### 使用说明
>若使用中，接口请求无数据，请查看前端请求接口与服务端提供的路径端口号是否一致

#### 稍微拿的出手的功能
>1、播放条区域，交互逻辑基本参考网易云音乐

>2、mv视频，采用了videojs和mui-player两个版本，添加了视频清晰度功能（目前用的是mui-player， 另一个版本可以堪源码）

#### 结束语
>实现了网易云音乐PC端一部分功能

>代码的优化及功能还有很大部分空间需要改进

>此版本也是公开的版本，若有新的进展，我会把代码更新到此版本

>关于项目的不足可以在下方评论，我会逐渐改进

>vue3 练手的第一个项目。边学边做，喜欢或者觉得有的学习的地方就动动你可爱的小手点个star吧~

#### 仅供学习使用 不作任何商业用途

>目前还未完全做完。

>之后完成会贴上效果图。

### watch笔记

```

## 路由的监听
>>>> vue3.0中的监听路由已经不能使用watch的方法
>>>> 改进方式，使用 onBeforeRouteUpdate

```
```

## 路由参数监听
const route = useRoute()
watch(() => route.query.xx, () => {})

注意：直接 watch(route, () => {}) 可以监听到, 但是 watch(route.query, () => {}) 不能监听到。

>>>>>>>>>>
>>>>>>>>>>
>>>>>>>>>>
总结：监听route时候使用() => {}函数getter函数返回值

```
```

## props监听
const props = definedProps({
  id: {
    type: String,
    default: () => (')
  }
})
watch(() => props.id, () => {})
或者
watch(props, () => {})
或者
watch(props.options, () => {})

>>>>>>>>>>
>>>>>>>>>>
>>>>>>>>>>
总结：三种方式都适用。

```
```

## ref监听
const name = ref('li')
watch(() => name.value, () => {}) 或者 watch(name, () => {})

>>>>>>>>>>
>>>>>>>>>>
>>>>>>>>>>
总结：监听ref时候，传入要么是直接 声明的变量，要么是 () => 变量.value

```
```

## reactive监听
const nameOptions = reactive({ name: 'xxx', age: 18 })
watch(() => nameOptions.name, () => {})

注意：这里直接监听 nameOptions 没有效果。

>>>>>>>>>>
>>>>>>>>>>
>>>>>>>>>>
总结：两种方式都适用

```

```

## computed监听
const comVal = computed(() => {})
watch(() => comVal.value, () => {}) 或者 watch(comVal, () => {})

>>>>>>>>>>
>>>>>>>>>>
>>>>>>>>>>
总结：监听reactive监听，使用() => {}函数getter函数返回值

```

## watch 大总结
```
######使用getter形式######：
1. 路由参数监听(() => route.query.变量名)
2. props监听(() => props.变量名)
3. ref监听(() => 变量名.value)
4. reactive监听(() => 变量名.reactive中的属性)
5. computed监听(() => 变量名.value)

######使用响应式对象######：
1. props监听(porps 或者 props.变量名)
2. ref监听(变量名称)
3. computed监听(变量名称)

```
