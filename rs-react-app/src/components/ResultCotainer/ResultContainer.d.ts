import { type DisneyApiResponse } from '../../types/charachterType';
interface ResultContainerProps {
  characters: DisneyApiResponse | null;
}
declare function ResultContainer({
  characters,
}: ResultContainerProps): import('react/jsx-runtime').JSX.Element;
export default ResultContainer;
