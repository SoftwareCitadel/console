export default function reorder<T>(items: T[], startIndex: number, endIndex: number) {
  const result = Array.from(items)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

