type CardProps = {
  imageUrl: string;
  name: string;
  films: string[];
  tvShows: string[];
};
declare function Card({
  imageUrl,
  name,
  films,
  tvShows,
}: CardProps): import('react/jsx-runtime').JSX.Element;
export default Card;
