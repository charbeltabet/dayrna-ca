export default function MediaSection() {
  return (
    <div style={{
      backgroundColor: 'var(--color-neutral)',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '20px 100px',
      gap: '50px'
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
        overflow: 'hidden',
        color: 'var(--color-base-300)',
      }}>
        <h1 className="text-4xl font-bold">
          Media
        </h1>
        <div style={{
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
          <div>
            <p className="text-2xl font-bold">
              Messes précédentes
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
              overflowX: 'scroll',
            }}>
              {/* render 10 squares using ts */}
              {Array.from({ length: 30 }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    minWidth: '200px',
                    aspectRatio: '1 / 1',
                    backgroundColor: 'var(--color-base-300)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <button className="btn btn-primary">
          Voir tous les medias
        </button>
      </div>
    </div>
  )
}
