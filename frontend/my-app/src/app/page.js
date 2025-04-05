'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import socketClient  from "socket.io-client";
import Button from '@mui/material/Button';
import Head from 'next/head';
import Script from 'next/script';
import styles from './page.module.css';
import { Typewriter } from 'react-simple-typewriter';


const App = () => {
    
    const router = useRouter();
    const [showSecondLine, setShowSecondLine] = useState(false);
    useEffect(() => {
        const delay = 'Welcome to StudyHive!'.length * 40 + 500; // characters x typeSpeed + a little buffer
        const timeout = setTimeout(() => {
          setShowSecondLine(true);
        }, delay);
    
        return () => clearTimeout(timeout);
      }, []);

    return (
      <>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>

        <Script
          src="https://d23jutsnau9x47.cloudfront.net/back/v1.0.9/viewer.js"
          data-who="💎 Made with naker.io 💎"
          data-option={`{
          "environment": {
            "gradient": "horizontal",
            "sensitivity": 1,
            "colorStart": [212, 188, 255, 1],
            "colorEnd": [249, 207, 237, 1]
          },
          "particle": {
            "life": 5,
            "power": 0.013,
            "texture": "https://res.cloudinary.com/naker-io/image/upload/v1566560053/star_02.png",
            "number": 769,
            "colorStart": [116, 129, 92, 0.13],
            "colorEnd": [198, 188, 107, 0.52],
            "sizeStart": 0.91,
            "sizeEnd": 1.82,
            "direction1": {"x": 0, "y": 0, "z": 100},
            "direction2": {"x": 0, "y": -100, "z": 0}
          },
          "waterMark": false
        }`}
          strategy="afterInteractive"
        />

        <div className={styles.page}>
          <h1>
            <Typewriter
              words={["Welcome to StudyHive!"]}
              typeSpeed={40}
              deleteSpeed={0}
              delaySpeed={1000000} // never delete
            />
          </h1>
          <br></br>

          {showSecondLine && (
            <h3>
              <Typewriter
                words={[
                  "Your app to find friends in class, check out course materials and build community!",
                ]}
                typeSpeed={40}
                deleteSpeed={0}
                delaySpeed={1000000} // never delete
              />
            </h3>
          )}

          <div style={{ marginTop: "20px" }}>
            <Button
              variant="contained"
              onClick={() => router.push("/registerUser")}
              style={{ padding: "10px 20px", margin: "10px", fontSize: "16px" }}
            >
              Register
            </Button>

            <Button
              variant="contained"
              onClick={() => router.push("/login-page")}
              style={{ padding: "10px 20px", margin: "10px", fontSize: "16px" }}
            >
              Login
            </Button>
          </div>
        </div>
      </>
    );
};

export default App;
