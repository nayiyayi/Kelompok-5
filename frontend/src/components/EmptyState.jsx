import { Link } from 'react-router-dom';

export default function EmptyState({ icon = 'fas fa-mug-hot', title, message, buttonText, buttonLink }) {
  return (
    <div className="empty-state animate-fade-up">
      <i className={icon} />
      <h3>{title}</h3>
      <p>{message}</p>
      {buttonText && buttonLink && (
        <Link to={buttonLink} className="btn btn-primary">
          {buttonText}
        </Link>
      )}
    </div>
  );
}
