import { Component } from 'react';

type CardProps = {
  imageUrl: string;
  name: string;
  films: string[];
  tvShows: string[];
};

class Card extends Component<CardProps> {
  render() {
    return (
      <div
        className="
        w-full 
        h-100
        max-w-[280px] 
        sm:max-w-[300px] 
        md:max-w-none 
        md:w-72 
        lg:w-80
        rounded-2xl 
        bg-white 
        shadow-md 
        hover:shadow-lg 
        transition-all 
        duration-300 
        border 
        border-gray-100
      "
      >
        <div
          className="
          flex 
          justify-center 
          w-11/12 
          max-w-[240px] 
          aspect-square 
          mx-auto 
          mt-4 
          overflow-hidden 
          rounded-xl 
          cursor-pointer
        "
        >
          <img
            src={this.props.imageUrl}
            alt={this.props.name}
            className="
              w-full 
              h-full 
              object-cover 
              transition-transform 
              duration-300 
              hover:scale-110
            "
          />
        </div>

        <div className="p-4 text-center">
          <p className="font-semibold text-gray-800 text-base sm:text-lg">
            {this.props.name}
          </p>

          <p className="text-gray-600 text-xs sm:text-sm mt-2 line-clamp-2">
            <span className="font-medium">Films:</span>{' '}
            {this.props.films.join(', ')}
          </p>

          <p className="text-gray-600 text-xs sm:text-sm mt-1 line-clamp-2">
            <span className="font-medium">TV shows:</span>{' '}
            {this.props.tvShows.join(', ')}
          </p>
        </div>
      </div>
    );
  }
}

export default Card;
