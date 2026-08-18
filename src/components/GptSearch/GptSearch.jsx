import GptMovieSuggestions from "./GptMovieSuggestions"
import GptSearchBar from "./GptSearchBar"

import { BG_LOGO } from "../../utils/constants"

const GptSearch = () => {
  return (
    <div className="relative min-h-dvh space-y-8 pb-12">
        <div className="fixed inset-0 -z-10" aria-hidden="true">
            <img src={BG_LOGO} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
        </div>
        <GptSearchBar/>
        <GptMovieSuggestions/>
    </div>
  )
}

export default GptSearch