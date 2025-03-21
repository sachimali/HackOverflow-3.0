import React from "react";

const ProductCard = ({ imageUrl, productName, price, category }) => {
  return (
    <div className="lg:w-1/4 md:w-1/2 p-4 w-full">
      <a className="block relative h-48 rounded overflow-hidden">
        <img
          alt={`${productName} - ${category}`}
          className="object-cover object-center w-full h-full block"
          src={imageUrl}
        />
      </a>
      <div className="mt-4">
        <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
          {category}
        </h3>
        <h2 className="text-gray-900 title-font text-lg font-medium">
          {productName}
        </h2>
        <p className="mt-1">${price}</p>
        <button className="mt-2 px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
