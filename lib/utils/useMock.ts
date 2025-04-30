export const useMock = () => {
  return process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
}
