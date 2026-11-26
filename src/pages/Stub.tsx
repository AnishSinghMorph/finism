// Placeholder until each page is built in a later stage.
export default function Stub({ title }: { title: string }) {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-6 pb-32 pt-32">
      <p className="eyebrow">Coming together</p>
      <h1 className="mt-4 text-6xl font-medium">{title}<em>.</em></h1>
    </section>
  )
}
