import React from "react";

export default class LoadingScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
        <div class="animate-spin loader ease-linear rounded-half border-4 border-t-4 border-gray-100 h-12 w-12 mb-4"></div>
        <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
        <p class="w-1/3 text-center text-white">If loading takes more than a few seconds, make sure the Signer is unlocked and reload this webapp.</p>
    </div>
    );
  }
}