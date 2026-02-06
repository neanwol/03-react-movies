import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';
import { fetchTrendingMovies, searchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Завантаження трендових фільмів при запуску
  useEffect(() => {
    const loadInitialMovies = async () => {
      setLoading(true);
      setError('');
      
      try {
        const data = await fetchTrendingMovies();
        setMovies(data.results);
        
        if (data.results.length === 0) {
          toast('No trending movies found', { icon: 'ℹ️' });
        }
      } catch (err) {
        setError('Failed to load trending movies. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialMovies();
  }, []);

  const handleSearch = async (query: string) => {
    setMovies([]);
    setError('');
    setLoading(true);
    
    try {
      const data = await searchMovies(query);
      
      if (data.results.length === 0) {
        toast.error('No movies found for your request.');
      }
      
      setMovies(data.results);
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css.container}>
      <SearchBar onSubmit={handleSearch} />
      
      {error && <ErrorMessage message={error} />}
      
      {loading && <Loader />}
      
      {!loading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} onMovieClick={setSelectedMovie} />
      )}
      
      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
}

export default App;