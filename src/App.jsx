import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Search } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import RecipeCard from './Components/RecipeCard';

const APP_ID = 'e9595357';
const APP_KEY = 'b3a598d6972b38e9d0264e6970bde9bb';
const USER_ID = 'shadosx';

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const controls = useAnimation();
  const { ref, inView } = useInView();

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.edamam.com/search?q=${search}&app_id=${APP_ID}&app_key=${APP_KEY}`,
        {
          method: 'GET',
          headers: {
            'Edamam-Account-User': USER_ID
          }
        }
      );
      const data = await response.json();
      if (data.count === 0) {
        setError('No recipes found for the given search.');
      } else {
        setRecipes(data.hits.map((hit) => hit.recipe));
        setError('');
      }
    } catch (error) {
      setError('An error occurred while fetching recipes.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchRecipes();
    }
  };

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <div className="App bg-green-500 min-h-screen">
      <div className="h-screen flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl text-white font-bold mb-8"
        >
          Recipe Finder
        </motion.h1>
        <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <div className="p-5 overflow-hidden w-[60px] h-[60px] hover:w-[270px] bg-green-500 shadow-[2px_2px_20px_rgba(0,0,0,0.08)] rounded-full flex group items-center hover:duration-300 duration-300">
              <div className="flex items-center justify-center fill-white">
                <Search className="text-white" size={24} />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search for a recipe..."
                className="outline-none text-[24px] bg-transparent w-full text-white font-normal px-4"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Oops!</strong>
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.758-3.15a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.029a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.15 2.758 3.15a1.2 1.2 0 0 1 0 1.697z" />
            </svg>
          </span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6" ref={ref}>
          {recipes.map((recipe, index) => (
            <motion.div
              key={index}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 50 }
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white"
            >
              {loading ? (
                <div className="h-48 bg-gray-200 animate-pulse"></div>
              ) : (
                <img className="w-full h-48 object-cover" src={recipe.image} alt={recipe.label} />
              )}
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-green-500">{recipe.label}</div>
                <p className="text-gray-700 text-base">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="list-disc ml-4">{ingredient.text}</li>
                  ))}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;