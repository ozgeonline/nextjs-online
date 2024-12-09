import { Languages } from "lucide-react"

export default function Lang__Select () {
  return (
    <div 
      className="flex items-center relative space-x-3 bg-main-dark/80 border border-muted-foreground rounded-sm"
    >
      <Languages className="absolute size-4 ml-2" />
      <label 
        htmlFor="language" 
        aria-labelledby="select" 
        className="hidden"
      ></label>
      <select  
        aria-labelledby="Aria Language" 
        name="language"
        id="language" 
        className="py-1 px-3 outline-none bg-main-dark/10 rounded-sm text-[0.85rem] size-8 sm:w-24 *:bg-main-white_100 *:text-black"
      >
        <option value="language-1" aria-label="hidden">English</option>
        <option value="language-2" aria-label="hidden">Türkçe</option>
      </select>
    </div>
  )
}