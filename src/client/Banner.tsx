import useDataContext from './hooks/useDataContext';

import spinner from '../icons/loading-spinner.svg';

function Banner() {
  const { loading, setLoading } = useDataContext();

  return (
    <div className={`banner ${loading ? 'loading' : ''}`}>
      <h6>haypenny</h6>
      {loading && (
        <div className="spinnerContainer">
          <img src={spinner} />
        </div>
      )}
    </div>
  );
}

export default Banner;
