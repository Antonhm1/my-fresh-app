import './BannerPreview.css';

const BannerPreview = () => {
  return (
    <section className="banner-preview">
      <div className="banner-preview-content">
        <h1>Welcome to Gislev Kirke</h1>
        <p>A place of worship, community, and faith in the heart of Gislev.</p>
        <img
          src="https://via.placeholder.com/800x400/87CEEB/ffffff?text=Gislev+Church"
          alt="Gislev Church"
          className="banner-preview-image"
        />
      </div>
    </section>
  );
};

export default BannerPreview;