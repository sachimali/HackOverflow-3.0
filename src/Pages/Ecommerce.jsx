import { useState, useEffect } from "react";
import Header from "../Components/Navbar";
import ProductCard from "../Components/ProductCard";
import { db } from "../Firebase/cofig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import { AnimatePresence, motion } from "framer-motion";

function Ecommerce() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "products"), where("approved", "==", true))
        );
        const productsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          imageUrl: doc.data().imageUrl,
          ...doc.data(),
        }));
        setProducts(productsArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-white">
        <div className="flex justify-center items-center h-full">
          <img
            className="h-16 w-16"
            src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif"
            alt=""
          />
        </div>
      </div>
    );
  }
  return (
    <>
      <div>
        <div>
          <Header />
        </div>
        <div
          className="py-6 sm:py-8 lg:py-12 "
          style={{ background: "#E2F5D2" }}
        >
          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
              <div>
                <div className="overflow-hidden rounded-lg bg-green-100 shadow-lg">
                  
                </div>
              </div>
              <div className="flex flex-col justify-between alimd:pt-8 text-black">
                <h2 className="mb-0 text-center text-4xl my-text font-fira-sans font-semibold md:text-center">
                  Embrace a <span className="text-green-600">Greener</span>{" "}
                  Tomorrow
                </h2>

                <div className="flex items-center justify-center">
                  <Link to="/requestproduct">
                    <button
                      type="submit"
                      className="inline-block my-10 rounded-lg bg-green-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-green-300 transition duration-100 hover:bg-green-600 focus-visible:ring active:bg-green-700 md:text-base"
                    >
                      Add Product
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="text-gray-600 my-5 body-font lg:px-32">
          <AnimatePresence>
            <div className="container px-5 py-15 mx-auto ">
              <div className="flex flex-wrap -m-4">
                {products.map((product, index) => (
                  <motion.div
                    className="lg:w-1/4 md:w-1/2 p-4 w-full"
                    key={product.id}
                    initial={{
                      opacity: 0,
                      y: 50,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 1,
                        delay: index * 0.1,
                      },
                      animate: {
                        opacity: 1,
                        y: 0,
                      },
                    }}
                    viewport={{ once: true }}
                  >
                    <div className="rounded-lg overflow-hidden px-2 h-[25rem] py-6 shadow-md hover:shadow-xl bg-gray-100 flex flex-col">
                      <a className="block relative h-48 rounded overflow-hidden">
                        <img
                          alt="Product"
                          className="object-cover object-center w-full h-full block"
                          src={product.imageUrl}
                        />
                      </a>
                      <div className="mt-4 flex-grow">
                        <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                          {product.category}
                        </h3>
                        <h2 className="text-gray-900 title-font text-lg font-medium overflow-clip">
                          {product.name}
                        </h2>
                        <p className="mt-1">Rs{product.price}</p>
                      </div>
                      <div className="mt-auto">
                        <a
                          href={product.affiliatedlink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 px-4 py-2 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 no-underline"
                          style={{ textDecoration: "none" }}
                        >
                          Shop Now
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimatePresence>

          <div className=" flex items-center justify-center sm:col-span-2">
            
          </div>
          
        </section>
      </div>
    </>
  );
}

export default Ecommerce;
