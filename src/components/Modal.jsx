import './Modal.css';

export default function Modal({ title, items, onClose }) {
  console.log("items",items);
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {items === null ? (
            <p className="loading-text">Loading...</p>
          ) : items.length > 0 ? (
            <div className="modal-grid">
              {items.map((item) => (
                <div key={item._id || item.id} className="modal-card">
                  <p><strong>Name:</strong> {item.name}</p>
                  {item.className && <p><strong>Class:</strong> {item.className}</p>}
                  {item.score && <p><strong>Score:</strong> {item.score}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p>No items to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}
