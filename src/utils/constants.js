export const BG_LOGO = "https://assets.nflxext.com/ffe/siteui/vlv3/0ce6c17e-e188-4f13-aaf2-6366e12ba739/web/IN-en-20260803-TRIFECTA-perspective_7730cca2-6324-4104-bf66-1a1f6e1a3e61_large.jpg"

export const DEFAULT_USER_AVATAR = "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"

export const MY_GITHUB_IMAGE = "https://avatars.githubusercontent.com/u/108607635?v=4"

export const OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json', 
    Authorization: 'Bearer '+ import.meta.env.VITE_TMDB_KEY,
  }
};

export const IMG_CDN_URL = "https://image.tmdb.org/t/p/w500/"

export const SUPPORTED_LANGUAGES = [
  {
    identifier: 'en', name: "English"
  },
  {
    identifier: 'hindi', name: "Hindi"
  },
  {
    identifier: 'spanish', name: "Spanish"
  }
]

// export const OPENAI_KEY = "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";

//uma account api key
export const OPENAI_KEY = import.meta.env.VITE_OPENAI_KEY