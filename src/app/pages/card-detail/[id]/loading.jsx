import Loader from "@/app/components/Loader/Loader"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <Loader />
    </div>
  )
}