export const handleTableScroll = (
  e: React.UIEvent<HTMLDivElement>,
  scrollContainerRef: any
) => {
  const target = e.currentTarget;
  const scrollTop = target.scrollTop;
  const scrollHeight = target.scrollHeight;
  const clientHeight = target.clientHeight;

  // Check if scrolled to bottom (with small threshold for precision)
  const isAtBottom = scrollTop + clientHeight >= scrollHeight - 300;

  if (isAtBottom) {
    scrollContainerRef.current.fetchNext()
  }
}
