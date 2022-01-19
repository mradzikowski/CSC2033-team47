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

// The main component for the landing page.

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

// The three-fiber scene container for displaying the 3d model

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

// Earth 3d model. Loads images and builds mesh
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
