
interface SearchHotItemProps {
  first: string
  iconType: number
  second: number
  third?: null
}

interface SearchHotProps {
  code: number
  result: {
    hots: SearchHotItemProps[]
  }
}

// interface
export {
  SearchHotItemProps,
  SearchHotProps
}
