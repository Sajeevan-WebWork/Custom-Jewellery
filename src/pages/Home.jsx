import React from 'react';
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import BestSellerSection from '../components/BestSellerSection';
import NewCollectionSection from '../components/NewCollectionSection';
import StorySection from '../components/StorySection';

const Home = () => {
  return (
    <div className="bg-bg-primary">
      <Hero />
      <CategorySection />
      <BestSellerSection />
      <NewCollectionSection />
      <StorySection />
    </div>
  );
};

export default Home;
