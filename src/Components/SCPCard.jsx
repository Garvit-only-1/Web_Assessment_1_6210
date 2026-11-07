
import { useEffect, useState } from "react";

function SCPCard({ scp, isAdmin, onEdit, onDelete }) {
  const [imageError, setImageError] = useState(false);

  // Get the image URL from Supabase
  const imageUrl = scp.image_url;

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  // Support internet URLs and local images
  function getImageUrl(url) {
    if (!url) return "";

    if (
      url.startsWith("https://") ||
      url.startsWith("http://")
    ) {
      return url;
    }

    if (url.startsWith("/")) {
      return url;
    }

    return "/" + url;
  }

  return (
    <div className="scp-card">

      {/* SCP Image */}
      <div className="scp-image-container">
        {imageUrl && !imageError ? (
          <img
            src={getImageUrl(imageUrl)}
            alt={`Image of ${scp.item}`}
            className="scp-image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="no-image">
            <p>Image not available</p>
          </div>
        )}
      </div>

      {/* SCP Information */}
      <div className="scp-content">

        <h2>{scp.item}</h2>

        <h3>{scp.name}</h3>

        <p>
          <strong>Object Class:</strong> {scp.class}
        </p>

        <h4>Description</h4>
        <p>{scp.description}</p>

        <h4>Special Containment Procedures</h4>
        <p>{scp.containment}</p>

        {/* Admin Only Buttons */}
        {isAdmin && (
          <div className="card-buttons">

            <button
              onClick={() => onEdit(scp)}
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => onDelete(scp)}
            >
              Delete
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default SCPCard;
