import toast from 'react-hot-toast';
import css from './SearchBar.module.css';

interface SearchBarProps {
  action: (formData: FormData) => void | Promise<void>;
}

export default function SearchBar({ action }: SearchBarProps) {
  const handleAction = async (formData: FormData) => {
    const query = (formData.get('query') as string)?.trim();
    
    if (!query) {
      toast.error('Please enter your search query.');
      return;
    }
    
    await action(formData);
  };

  return (
    <header className={css.header}>
      <div className={css.container}>
        <a
          className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form className={css.form} action={handleAction}>
          <input
            className={css.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button className={css.button} type="submit">
            Search
          </button>
        </form>
      </div>
    </header>
  );
}