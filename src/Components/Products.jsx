import React, { useState, useEffect } from "react";
import Header from "../Components/Navbar";
import ProductCard from "../Components/ProductCard";
import { db } from "../Firebase/cofig";
import { Link } from "react-router-dom";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { motion } from "framer-motion";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "products"), limit(3));
        const querySnapshot = await getDocs(q);

        const productsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          imageUrl: doc.data().imageUrl,
          ...doc.data(),
        }));
        console.log("fetching");
        setProducts(productsArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="text-gray-600 body-font">
      <div className="h-1 bg-gray-200 rounded overflow-hidden md:w-5/6 mx-auto">
        <div className="w-ful h-full bg-green-500"></div>
      </div>
      <div className="container p-5 mx-auto">
        <div className="flex flex-col">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-3xl pb-6">
              Shop our Eco-friendly Products
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-center">
              Embrace a Greener Lifestyle, Embody Eco-Friendly Choices;
              Together, Let's Nourish Our Planet, Conserve Resources, and
              Cultivate a Sustainable Legacy for Generations to Come.
            </p>
          </div>
        </div>
        <section className="text-gray-600 body-font">
          <div className="container px-15 mx-auto">
            <div className="flex flex-wrap -m-4 justify-center items-center">
              {products.map((product, index) => (
                <motion.div
                  className="lg:w-1/4 md:w-1/2 px-4 w-full py-2"
                  key={product.id}
                  initial={{
                    opacity: 0,

                    y: 50,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 1,
                      delay: index * 0.2,
                    },
                    animate: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                  viewport={{ once: false }}
                >
                  <div className="rounded-lg overflow-hidden px-2 shadow-md hover:shadow-xl p-2 bg-gray-100 ">
                    <a className="block relative h-48 rounded overflow-hidden ">
                      <img
                        alt="Product"
                        className="object-cover object-center w-full h-full block "
                        src={product.imageUrl}
                      />
                    </a>
                    <div className="mt-4">
                      <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                        {product.category}
                      </h3>
                      <h2 className="text-gray-900 title-font text-lg font-medium">
                        {product.name}
                      </h2>
                      <p className="mt-1">${product.price}</p>
                      <button
                        onClick={() =>
                          (window.location.href = product.affiliatedlink)
                        }
                        className="mt-2 px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Shop Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className=" m-5 flex items-center justify-center sm:col-span-2">
          <Link to="/ecommerce">
            <button
              type="submit"
              className="inline-block  rounded-lg bg-green-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-green-300 transition duration-100 hover:bg-green-600 focus-visible:ring active:bg-green-700 md:text-base"
            >
              Explore more products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Products;
