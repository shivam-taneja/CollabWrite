import { Loader2 } from "lucide-react"

const Loading = () => {
  return (
    <section className="bg-gradient-auth min-h-screen w-full flex justify-center items-center">
      <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
    </section>
  )
}

export default Loading