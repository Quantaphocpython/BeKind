export const delayed = (delayedTime: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve(true)
      clearTimeout(timer)
    }, delayedTime)
  })
}
