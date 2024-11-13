import React from 'react';
import { registerRootComponent } from 'expo';
import Navigation from './src/navigation/NavigationContainer';

const App = () => {
  return <Navigation />;
};

registerRootComponent(App);
