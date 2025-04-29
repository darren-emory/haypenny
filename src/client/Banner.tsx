import useDataContext from './hooks/useDataContext';

function Banner() {
  const { loading, setLoading } = useDataContext();

  return (
    <div className={`banner ${loading ? 'loading' : ''}`}>
      <h6>haypenny</h6>
      {loading && (
        <div className="spinnerContainer">
          <img src="/loading-spinner.svg" alt="Loading spinner" />
        </div>
      )}
    </div>
  );
}

export default Banner;
