import './Banner.css';

interface BannerProps {
  image: string;
  title: string;
  description: string;
}

const Banner = ({ image, title, description }: BannerProps) => {
  return (
    <div className="banner">
      <img src={image} alt={title} className="banner-image" />
      <div className="banner-content">
        <h3 className="banner-title">{title}</h3>
        <p className="banner-description">{description}</p>
      </div>
    </div>
  );
};

export default Banner;