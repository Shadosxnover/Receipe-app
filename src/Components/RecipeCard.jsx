import React from 'react';
import { motion } from 'framer-motion';

const RecipeCard = ({ recipe, loading }) => {
  return (
    <motion.div
      className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
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
  );
};

export default RecipeCard;