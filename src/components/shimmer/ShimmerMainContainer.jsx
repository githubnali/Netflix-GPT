const ShimmerMainContainer = () => {
  return (
    <main className="relative z-0 h-[100dvh] overflow-hidden bg-black">
      <section className="absolute inset-0 z-10 bg-gradient-to-r from-black via-black/70 to-transparent">
        <div className="flex h-full w-full max-w-xl flex-col justify-center gap-4 px-4 pt-14 sm:px-8 sm:pt-16 md:max-w-2xl md:px-12">
          <div className="h-9 w-3/4 rounded shimmer sm:h-11 md:h-14" />
          <div className="hidden space-y-2 py-5 sm:block md:py-6">
            <div className="h-3 w-full rounded shimmer" />
            <div className="h-3 w-full rounded shimmer" />
            <div className="h-3 w-2/3 rounded shimmer" />
          </div>
          <div className="mt-5 flex flex-wrap gap-3 sm:mt-0 sm:gap-4">
            <div className="h-10 w-28 rounded shimmer sm:h-12 sm:w-36" />
            <div className="hidden h-10 w-36 rounded shimmer sm:block sm:h-12 sm:w-44" />
          </div>
        </div>
      </section>
    </main>
  )
}

export default ShimmerMainContainer
