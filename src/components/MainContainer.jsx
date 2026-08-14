import { useSelector } from "react-redux"
import VideoTitle from "./VideoTitle";
import VideoBackground from "./VideoBackground";

const MainContainer = () => {
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);

  if (!movies) return null;

  
  const mainMovie = movies[0];



  const { original_title, overview, id } = mainMovie;



  return (
    <main className="fixed inset-0 overflow-hidden bg-black">
        <VideoTitle 
          title={original_title} overview={overview} 
        />
        <VideoBackground movieId={id}/>
    </main>
  )
}

export default MainContainer
