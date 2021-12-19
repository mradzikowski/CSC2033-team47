import {state, Suspense, useEffect, useState} from 'react';
import SearchBar from './SearchBar'
import {Canvas, useLoader, useFrame} from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import {EffectComposer, DepthOfField, Bloom} from '@react-three/postprocessing'
import React from 'react'

// TODO: Search Button, Search Functionality


/*
    Function:
        - Main function for the landing page. Returns all components that will be displayed
        when user accesses the landing page.

    (written by Toby Dixon)
*/
function LandingPage() {

    const [data, setData] = useState(0) 

    useEffect(() => {
        fetch(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
        .then(res => res.json())
        .then(data =>{
            setData(data)
            console.log(data)
        })}, [])

    return(
        <div className='App-header'>
            <h1>ClimateXtractor</h1>
            {/* if data is gathered, render it. Otherwise render 'non' */}
            {/* {data==0 ? 'non' : <Users props={data} />} */}
            <SearchBar></SearchBar>
            <Scene />
        </div>
    )
}


/*
    Function:
        - The scene in which the 3D earth model is displayed on in the background.

    (written by Toby Dixon)
*/

const Scene = () => {
    
    return (
        <div className='Earth'>
            <Suspense fallback={null}>
                <Canvas style={{position: 'relative', width: 600, height: 600}}>
                <pointLight intensity={0.6} position={[20,20,10]} color={'orange'}/>
                <ambientLight intensity={0.2} />
                    <Earth className='Earth'></Earth>
                    <EffectComposer>
                        <Bloom luminanceThreshold={0} luminanceSmoothing={0.4} height={500} />
                    </EffectComposer>
                </Canvas>
            </Suspense>

        </div>
    )
}

/*
    Function:
        - Creation of the Earth model

    (written by Toby Dixon)
*/


const Earth = () => {

    const [base, disp] = useLoader(TextureLoader, [`${process.env.PUBLIC_URL}/earth-map.jpg`, `${process.env.PUBLIC_URL}/glossy-map.jpg`])
    const mesh = React.useRef()

    useFrame(({clock}) => {
        mesh.current.rotation.y = clock.getElapsedTime() / 12
        mesh.current.rotation.x = clock.getElapsedTime() / 64
    })

    return (

        <mesh ref={mesh}>
        <sphereGeometry attach='geometry' args={[2, 16, 16]}/>
        <meshStandardMaterial map={base} roughnessMap={disp} color="white"/>
        </mesh>
    )
}


/*
    Function:
        - Temporary function to test that data gathered from the api can be displayed.

    (written by Toby Dixon)
*/

const Users = (props) => {

    let final = []
    for (let user of props.props){
      final.push(<h2>username: {user.username}, id: {user.user_id}, email: {user.email}, date created: {user.date_created}</h2>)
    }
  
    return(
      <ul>{final}</ul>
    )
  }
  

export default LandingPage;