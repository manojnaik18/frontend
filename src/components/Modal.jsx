import './Modal.css';

export default function Modal({ title, items, onClose, renderItem }) {
  if (!items) return null;

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
          {items.length > 0 ? (
            <ul className="modal-list">{items.map(renderItem)}</ul>
          ) : (
            <p>No items to display.</p>
          )}
        </div>
      </div>
    </div>
  );
}