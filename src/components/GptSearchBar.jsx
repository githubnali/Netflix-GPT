import { useSelector } from "react-redux"
import lang from "../utils/languageConstants"

const GptSearchBar = () => {

    const langKey = useSelector((store) => store.config.lang);
  return (
    <div className="pt-[8%] flex justify-center">
        <form className='p-6 bg-black/70 w-3/4 grid grid-cols-12'>
            <input
                type='text'
                placeholder={lang[langKey].gptSearchPlaceholder}
                className='p-4 mr-4 border-gray-800 border-2 rounded col-span-10 text-2xl bg-white'
            />
            <button className="py-2 px-4 bg-red-700 text-white rounded-lg col-span-2 text-xl font-semibold">{lang[langKey].search}</button>
        </form>
    </div>
  )
}

export default GptSearchBar