export default function SouvenirSection() {
  return (
    <div style={{
      backgroundColor: 'var(--color-base-300)',
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
        color: 'var(--color-neutral)',
      }}>
        <h1 className="text-4xl font-bold">
          Souvenirs
        </h1>
        <div style={{
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}>
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
                  backgroundColor: 'var(--color-neutral)',
                }}
              />
            ))}
          </div>
        </div>
        <button className="btn btn-primary">
          Voir tous les souvenirs
        </button>
      </div>
    </div>
  )
}
