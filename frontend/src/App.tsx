import React, { useState } from 'react';
import { useSongs } from './hooks/useSongs';
import FileUpload from './components/FileUpload/FileUpload';
import SongsTable from './components/SongsTable/SongsTable';
import SearchBar from './components/SearchBar/SearchBar';
import ExportButton from './components/ExportButton/ExportButton';
import DanceabilityScatter from './components/charts/DanceabilityScatter';
import DurationHistogram from './components/charts/DurationHistogram';
import AcousticsTempoBars from './components/charts/AcousticsTempoBars';
import styles from './App.module.scss';

const App: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortBy, setSortBy] = useState('title');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const { data, isLoading, isFetching, error } = useSongs(page, pageSize, sortBy, order);

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
    setPage(1);
  };

  const isEmpty = !data || data.total === 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <h1>Melodytics</h1>
          <p>Advanced Playlist Intelligence</p>
        </div>
        <FileUpload />
      </header>

      <main className={styles.main}>
        <SearchBar />

        {isLoading && !data ? (
          <div className={styles.loading}>Analyzing your playlist...</div>
        ) : error ? (
          <div className={styles.error}>Failed to load music data. Is the backend running?</div>
        ) : isEmpty ? (
          <div className={styles.empty}>
            <h2>No songs found.</h2>
            <p>Upload a <code>songs.json</code> file to get started.</p>
          </div>
        ) : (
          <>
            <div className={styles.actions}>
              <ExportButton songs={data.items} />
              {isFetching && <span className={styles.fetchingIndicator}>Updating...</span>}
            </div>

            <SongsTable
              data={data}
              sortBy={sortBy}
              order={order}
              onPageChange={setPage}
              onSortChange={handleSort}
            />

            <section className={styles.dashboard}>
              <div className={styles.card}>
                <DanceabilityScatter data={data.items} />
              </div>
              <div className={styles.card}>
                <DurationHistogram data={data.items} />
              </div>
              <div className={styles.card}>
                <AcousticsTempoBars data={data.items} />
              </div>
            </section>
          </>
        )}
      </main>

      <footer className={styles.footer}>
        Melodytics &copy; {new Date().getFullYear()} — Powered by FastAPI & React
      </footer>
    </div>
  );
};

export default App;
