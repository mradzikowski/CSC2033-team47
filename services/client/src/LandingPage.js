import { state, Suspense, useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { withRouter } from "react-router-dom";
import DatasetsList from "./components/DatasetsList";
import Select from "react-select";
import Button from "@mui/material/Button";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import React from "react";
import { checkPropTypes } from "prop-types";
import NasaData from "./components/NasaData";

// TODO: Replace search bar with dropdown that shows all categories as optional filters for searching.
// TODO: Create a new filter component that is added somewhere to the screen when a filter is chosen.
// TODO: Create a new page that displays gathered information on info-cards or some other format
// When a search is initiated, filtered by categories.
// TODO: Either hardcode categories or come up with a more efficient way to grab them (at the moment i am grabbing all data)

/*
    Function:
        - Main function for the landing page. Returns all components that will be displayed
        when user accesses the landing page.

    (written by Toby Dixon)
*/

class LandingPage extends React.Component {
  constructor(props) {
    super(props);
  }

  callSearch = (query) => {
    this.props.history.push("/datasets", { state: query });
  };

  render() {
    return (
      <div>
        <h1>CLIMATEXTRACTOR</h1>
        <SearchBar search={this.callSearch} />
        <Scene />
      </div>
    );
  }
}

/*
    Function:
        - The scene in which the 3D earth model is displayed on in the background.

    (written by Toby Dixon)
*/

const Scene = () => {
  return (
    <div className="Earth">
      <Suspense fallback={null}>
        <Canvas style={{ position: "relative", width: 600, height: 600 }}>
          <pointLight intensity={0.6} position={[20, 20, 10]} color="orange" />
          <ambientLight intensity={0.4} />
          <Earth className="Earth" />
          {/* <EffectComposer>
            <Bloom
              luminanceThreshold={0.1}
              luminanceSmoothing={0.2}
              height={800}
            />
          </EffectComposer> */}
        </Canvas>
      </Suspense>
    </div>
  );
};

/*
    Function:
        - Creation of the Earth model

    (written by Toby Dixon)
*/

const Earth = () => {
  const [base, disp] = useLoader(TextureLoader, [
    `${process.env.PUBLIC_URL}/earth-map.jpg`,
    `${process.env.PUBLIC_URL}/glossy-map.jpg`,
  ]);
  const mesh = React.useRef();

  useFrame(({ clock }) => {
    mesh.current.rotation.y = clock.getElapsedTime() / 12;
    mesh.current.rotation.x = clock.getElapsedTime() / 64;
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry attach="geometry" args={[2, 16, 16]} />
      <meshStandardMaterial map={base} roughnessMap={disp} color="white" />
    </mesh>
  );
};

export default withRouter(LandingPage);
